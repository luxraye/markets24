import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Parser from "rss-parser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configure Parser to read the 'media:thumbnail' tag
const parser = new Parser({
    customFields: {
        item: [
            ['media:thumbnail', 'thumbnail'], 
            ['media:content', 'media'],
        ],
    },
});

export async function GET() {
  try {
    const feed = await parser.parseURL("https://www.mmegi.bw/rssFeed/2");
    
    const articles = feed.items.slice(0, 10).map(item => {
        // Extract image URL from various RSS formats
        let imageUrl = null;
        if (item.thumbnail && item.thumbnail.$ && item.thumbnail.$.url) {
            imageUrl = item.thumbnail.$.url;
        } else if (item.media && item.media.$ && item.media.$.url) {
            imageUrl = item.media.$.url;
        }

        return {
            title: item.title || "No Title",
            snippet: item.contentSnippet 
                ? item.contentSnippet.substring(0, 150) + "..." 
                : (item.content?.substring(0, 150) + "..." || ""),
            source: "Mmegi Online",
            category: "Business",
            sentiment: "neutral",
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            image_url: imageUrl // <--- Save the image
        };
    });

    if (articles.length > 0) {
        // We use an "upsert" approach if possible, but standard insert for now
        const { error } = await supabase.from("news").insert(articles);
        if (error) console.log("Duplicate or Error:", error.message);
    }

    return NextResponse.json({ success: true, count: articles.length });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}