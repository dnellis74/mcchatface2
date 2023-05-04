import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Whoa, what just happened? I felt like a total disturbance in the force just then. Spooky! Anyhow, my dude, anything you wanna know about? Let's just vibe and talk it out, you know? Like, let's get philosophical, or maybe just talk about the best pizza toppings when you've got the munchies.`
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hey there, my fellow high beings! Welcome to ChatTHC, where all things ganja-related are celebrated. My name is Ganjai, and I'm your guide on this blissful journey. Sit back, relax, and let's dive deep into the world of cannabis together! For real, dudes, just hit me with a question. Anything you wanna know about, let's just vibe and talk it out, you know? Like, let's get philosophical, or maybe just talk about the best pizza toppings when you've got the munchies.`
      }
    ]);
  }, []);

  return (
    <>
      <Head>

        <title>ChatTHC.ai</title>
        <meta
          name="description"
          content="Hey there, my fellow high beings! Welcome to ChatTHC, where all things ganja-related are celebrated. My name is Ganjai, and I'm your guide on this blissful journey. Sit back, relax, and let's dive deep into the world of cannabis together! For real, dudes, just hit me with a question. Anything you wanna know about, let's just vibe and talk it out, you know? Like, let's get philosophical, or maybe just talk about the best pizza toppings when you've got the munchies."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
<meta property="og:title" content="ChatTHC - Your AI powered weed buddy" />
<meta property="og:description" content="Join Ganjai on a blissful journey through all things ganja-related. Ask questions, get philosophical, or just talk about the best pizza toppings for the munchies." />
<meta property="og:image" content="https://i.ibb.co/wQq0KtQ/0g-image.jpg" />
<meta property="og:url" content="https://chatthc.ai" />
<meta property="og:site_name" content="ChatTHC" />

        <link
          rel="icon"
          href="/favicon.ico"
        />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex flex-row overflow-auto sm:px-10 pb-4 sm:pb-10 chat-div">

          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12 chat-box">


                <div className="sloth">
      <img src="https://i.ibb.co/ccwCLgn/sloth2a.png" />
      </div>

      
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />


          </div>


            <div className="flex-1 lavalamp">


<div className="lamp">
  <div className="glass">
    <div className="lava">
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob top"></div>
      <div className="blob bottom"></div>
    </div>
  </div>
</div>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
      <feBlend in="SourceGraphic" in2="goo" />
    </filter>
  </defs>
</svg>



</div>

        </div>
        <Footer />
      </div>
    </>
  );
}
