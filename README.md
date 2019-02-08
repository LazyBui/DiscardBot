# DiscardBot
A basic Discord bot shell. Written for Node 10.15.1. May not be compatible with other versions of Node.

# Installation commands
You'll need to execute the following commands in the source directory to get this set up. The ordering is important.

* `npm install discord.io winston -save`
* `npm install https://github.com/woor/discord.io/tarball/gateway_v6`
* `npm install fs`
* `npm install path`

# Token/Discord bot setup
You'll also need to copy your Discord bot token to `token.txt` in the source directory.

* Navigate to `http://discordapp.com/developers/applications/me` while logged into Discord and click "New Application".
* Give the bot a name and click "Create".
* Navigate to the "Bot" submenu under this application.
* Click "Add Bot" and then "Yes, do it!"
* Once this is done, you have your bot. Obtain the token and place it in `token.txt`.
* To make the bot join a server, go to the "General Information" submenu and copy the Client ID.
* Navigate to `https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8` with CLIENTID replaced with the text of the Client ID you copied.
* Once you select the appropriate server, click "Authorize". The bot should now join the server.

# Running
After these are set up, you run the bot using `node bot.js` in a command prompt in the source directory. On Windows, you can stop the bot at any time by using CTRL + C in the prompt.