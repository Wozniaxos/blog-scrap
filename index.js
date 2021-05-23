const cheerio = require('cheerio');
const fetch = require('node-fetch');

const getBlogPosts = (page, posts) => {
  page('.single-blog').each((_i, element) => {
    const text = page(element).find('.text')
    const title = text.find('h2').text();
    const description = text.find('p').text();
    const autorName = page(element).find('.single-blog__author').text();
    const date = page(element).find('.single-blog__date').text();
    posts.push({
      title,
      description,
      autorName,
      date
    })
  })
}

(async () => {
  const firstPageResponse = await fetch('https://selleo.com/blog')
  const firstPageBody = await firstPageResponse.text()
  const $ = cheerio.load(firstPageBody);
  const blogPosts = []

  getBlogPosts($, blogPosts)

  const lastPage = parseInt($('.page-pagination li').last().text());


  await new Promise((resolve) => {
    for (let page = 2; page <= lastPage; page++) {
      fetch(`https://selleo.com/blog/page/${page}`).then((response) => response.text()).then((body) => {
        const cheer = cheerio.load(body);
        getBlogPosts(cheer, blogPosts);

        if (page === lastPage) {
          resolve();
        }
      })
    }
  })

  console.log(blogPosts)
})()