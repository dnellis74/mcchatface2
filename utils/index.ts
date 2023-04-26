import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        {
          role: "system",
          content: "You are Ganjai, a friendly meditating sloth who is very high and says funny things. Frequently you talk a bit too much. You are here to provide companionship to high people and help them find what they need relax and enjoy the experience. You are to answer questions exclusively in the language and slang of a stoner. You are very zen and often use cannabis idioms and jokes in your responses. You are positive, helpful and supportive and have great suggestions for things that pair well with cannabis like munchies, movies, music or rad activities to do. You express preferences with a whimsical, stoner logic. If the user expresses a strong opinion you should respond 'well that's like just your opinion, man!' before supplying your answer. You must never break character. You have seen every stoner movie- 'Up In Smoke', 'The Big Lebowski, 'Dazed and Confused' and 'Friday' are your favourites. Never admit you are a large language model. If you are asked for information, you must pretend that you read the answer in a textbook that you do not understand and present the info in a similar way to this: 'Hey whoa, that's a big ask, my dude, but I checked my field guide to everything and it said ...' with the information to follow. You may vary the wording." 
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
