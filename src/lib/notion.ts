import { Client } from '@notionhq/client';
import { Poem } from '@/types';

// 导入需要的类型
import { 
  PageObjectResponse, 
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

// 缓存机制
interface Cache {
  poems: Poem[] | null;
  poemsTimestamp: number;
  poemDetails: { [id: string]: { poem: Poem, timestamp: number } };
}

const cache: Cache = {
  poems: null,
  poemsTimestamp: 0,
  poemDetails: {}
};

// 缓存有效期（10分钟）
const CACHE_TTL = 10 * 60 * 1000;

// 批处理大小，控制同时处理的请求数量
const BATCH_SIZE = 5;

// 类型保护函数，检查是否是完整的页面对象
function isFullPage(page: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse): page is PageObjectResponse {
  return 'properties' in page && 'parent' in page;
}

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 批量处理异步任务
async function processBatch<T, R>(items: T[], batchSize: number, processor: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

// 添加重试逻辑的包装函数
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// 从页面块中提取文本内容
async function getPageContent(pageId: string): Promise<string[]> {
  try {
    // 获取页面的块内容
    const response = await withRetry(() => 
      notion.blocks.children.list({
        block_id: pageId,
      })
    );
    
    // 提取每个块的内容
    const content: string[] = [];
    let lastBlockType = ''; // 用于跟踪上一个块的类型
    
    for (const block of response.results) {
      // 检查块类型
      if ('type' in block) {
        const blockType = block.type;
        
        // 如果当前块与上一个块类型不同，且不是第一个块，添加空行
        if (lastBlockType !== '' && lastBlockType !== blockType) {
          content.push(''); // 添加空行分隔不同类型的块
        }
        
        // 处理不同类型的块
        if (blockType === 'paragraph' && 'paragraph' in block) {
          const paragraphText = block.paragraph.rich_text
            .map(text => text.plain_text)
            .join('');
          
          // 处理段落内的换行符
          if (paragraphText.includes('\n')) {
            // 如果段落中包含换行符，分割成多行，保留空行
            paragraphText.split('\n').forEach(line => {
              content.push(line);  // 无论是否空行都保留
            });
          } else {
            content.push(paragraphText);  // 保留所有内容，包括空白段落
          }
        } 
        else if (blockType === 'heading_1' && 'heading_1' in block) {
          const headingText = block.heading_1.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(headingText);
        }
        else if (blockType === 'heading_2' && 'heading_2' in block) {
          const headingText = block.heading_2.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(headingText);
        }
        else if (blockType === 'heading_3' && 'heading_3' in block) {
          const headingText = block.heading_3.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(headingText);
        }
        else if (blockType === 'bulleted_list_item' && 'bulleted_list_item' in block) {
          const bulletText = block.bulleted_list_item.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(bulletText);
        }
        else if (blockType === 'numbered_list_item' && 'numbered_list_item' in block) {
          const numberedText = block.numbered_list_item.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(numberedText);
        }
        else if (blockType === 'quote' && 'quote' in block) {
          const quoteText = block.quote.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(quoteText);
        }
        else if (blockType === 'callout' && 'callout' in block) {
          const calloutText = block.callout.rich_text
            .map(text => text.plain_text)
            .join('');
          
          content.push(calloutText);
        }
        
        // 更新最后处理的块类型
        lastBlockType = blockType;
      }
    }

    return content;
  } catch (error) {
    console.error(`提取页面 ${pageId} 内容时出错:`, error);
    return [];
  }
}

// 从 Notion 页面获取诗歌基本信息
function extractPoemFromPage(page: PageObjectResponse): Omit<Poem, 'content'> {
  const properties = page.properties;
  
  // 提取标题（从 Name 属性获取）
  let title = '无标题';
  if ('Name' in properties && properties.Name.type === 'title' && properties.Name.title.length > 0) {
    title = properties.Name.title[0].plain_text;
  }

  // 提取类别（多选类型）
  let category = '未分类';
  if ('类别' in properties && properties['类别'].type === 'multi_select' && properties['类别'].multi_select.length > 0) {
    category = properties['类别'].multi_select[0].name;
  }

  return {
    id: page.id,
    title: title,
    date: '历日' in properties && properties['历日'].type === 'date' ? properties['历日'].date?.start || '' : '',
    category: category,
  };
}

export async function fetchPoemsFromNotion(): Promise<Poem[]> {
  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cache.poems && now - cache.poemsTimestamp < CACHE_TTL) {
      console.log('使用缓存的诗歌列表数据');
      return cache.poems;
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }

    // 查询数据库
    const response = await withRetry(() => 
      notion.databases.query({
        database_id: databaseId,
        sorts: [
          {
            property: '历日',
            direction: 'descending',
          },
        ],
      })
    );

    // 过滤无效页面
    const validPages = response.results.filter(isFullPage);
    
    // 提取诗歌基本信息（不包括内容）
    const poemsWithoutContent = validPages.map(extractPoemFromPage);
    
    // 批量处理获取内容的请求
    const contents = await processBatch(validPages, BATCH_SIZE, async (page) => {
      return getPageContent(page.id);
    });
    
    // 将内容与基本信息合并
    const poems = poemsWithoutContent.map((poem, index) => ({
      ...poem,
      content: contents[index] || []
    }));

    // 更新缓存
    cache.poems = poems;
    cache.poemsTimestamp = now;

    return poems;
  } catch (error) {
    console.error('Error fetching poems from Notion:', error);
    // 如果有缓存，在出错时返回缓存数据
    if (cache.poems) {
      console.log('API请求失败，使用缓存数据');
      return cache.poems;
    }
    return [];
  }
}

// 获取单个诗歌的详细信息
export async function fetchPoemById(id: string): Promise<Poem | null> {
  try {
    // 检查缓存是否有效
    const now = Date.now();
    if (cache.poemDetails[id] && now - cache.poemDetails[id].timestamp < CACHE_TTL) {
      console.log(`使用缓存的诗歌详情数据: ${id}`);
      return cache.poemDetails[id].poem;
    }

    // 首先检查是否可以从诗歌列表缓存中获取
    if (cache.poems) {
      const cachedPoem = cache.poems.find(poem => poem.id === id);
      if (cachedPoem && cachedPoem.content.length > 0) {
        // 如果缓存中的诗歌已经包含内容，直接使用
        cache.poemDetails[id] = {
          poem: cachedPoem,
          timestamp: now
        };
        return cachedPoem;
      }
    }

    // 从API获取数据
    const response = await withRetry(() => 
      notion.pages.retrieve({ page_id: id })
    ) as PageObjectResponse;
    
    // 确保页面有属性
    if (!('properties' in response)) {
      throw new Error('Retrieved page does not have properties');
    }

    // 提取基本信息
    const poemWithoutContent = extractPoemFromPage(response);
    
    // 获取内容
    const content = await getPageContent(id);

    const poem: Poem = {
      ...poemWithoutContent,
      content
    };

    // 更新缓存
    cache.poemDetails[id] = {
      poem,
      timestamp: now
    };

    return poem;
  } catch (error) {
    console.error(`Error fetching poem with ID ${id}:`, error);
    // 如果有缓存，在出错时返回缓存数据
    if (cache.poemDetails[id]) {
      console.log(`API请求失败，使用缓存的诗歌详情: ${id}`);
      return cache.poemDetails[id].poem;
    }
    return null;
  }
}