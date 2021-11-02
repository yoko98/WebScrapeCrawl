/*
1. initial setup - fetching data with axios or node-fetch
2. fetching html
3. searching for elements
4. crawling the links
5. stay on the same page
    - const {host, protocol} = urlParser.parse(url); 
6. handle abs vs relative links
7. downloading links
http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/
*/

const Apify = require('apify');

Apify.main(async () => {
    // Create a RequestList
    const requestList = await Apify.openRequestList('start-urls', [
        { url: 'https://warsi.or.id/id/program-kami/' },
        { url: 'https://haratoken.io/' },
        { url: 'http://ecoton.org/' },
    ]);
    // Function called for each URL
    const handlePageFunction = async ({ request, $ }) => {
        const title = $('title').text();
        console.log(`URL: ${request.url}\nTITLE: ${title}`);
    };
    // Create a CheerioCrawler
    const crawler = new Apify.CheerioCrawler({
        requestList,
        handlePageFunction: async ({ request, response, body, contentType, $ }) => {
            const data = [];
            // Do some data extraction from the page with Cheerio.
            // data.push($('.awardee-list').text())

            // org
            $('.box').each((index, el) =>
            {

                title= $(el).find('a:eq(0)').text();
                href= $(el).find('a:eq(0)').attr('href');

                $(el).find("a").first().remove();

                test= []

                // for (let i = 0; i < $(el).find("a").length(); i++)
                // {
                //     test.append($(el).find(`a:eq(i)`).text());
                // }

                title2= $(el).find('a').text();
                href2= $(el).find('a').attr('href');


                data.push([title, href, title2, href2])
            });

            // Save the data to dataset.
            await Apify.pushData({
                data
            });
        },
    });
    // Run the crawler
    await crawler.run();
});