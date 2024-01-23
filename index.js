import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
// Welcome to the Chatbot
  console.log(colors.bold.green('Welcome!'));
  console.log(colors.bold.green('Start chatting with the bot!'));
  console.log(colors.gray('ie: What is an async function?'));

  const chatHistory = []; // Array that stores conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Construct messages by iterating over the chatHistory
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Take the latest userInput and push it to the messages array
      messages.push({ role: 'user', content: userInput });

      // Call the Open AI API with userInput & chatHistory
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      // If the userInput is equal to exit, return completion text and close
      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();
