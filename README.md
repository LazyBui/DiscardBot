# DiscardBot
A basic Discord bot shell. Written for Node 10.15.1. May not be compatible with other versions of Node.

# Installation commands
You'll need to execute the following commands in the source directory to get this set up. The ordering is important.

* First, open a PowerShell with administrator privileges. If you do not have PowerShell, install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) ([Visual Studio Express 2015 for Windows Desktop](https://visualstudio.microsoft.com/vs/older-downloads/) is recommended for Windows 7).
* `npm config set msvs_version 2015`
* `npm install --global --production windows-build-tools`
* `npm install --global node-gyp`

* Next, open up a command prompt in the DiscardBot project root.
* `npm install`

# Token/Discord bot setup
You'll also need to copy your Discord bot token to a `token.txt` file in the source directory.

* Navigate to `https://discordapp.com/developers/applications/me` while logged into Discord and click "New Application".
* Give the bot a name and click "Create".
* Navigate to the "Bot" submenu under this application.
* Click "Add Bot" and then "Yes, do it!"
* Once this is done, you have your bot. Create `token.txt`, obtain the token, and paste it into the file.
* To make the bot join a server, go to the "General Information" submenu and copy the Client ID.
* Navigate to `https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8` with CLIENTID replaced with the text of the Client ID you copied.
* Once you select the appropriate server, click "Authorize". The bot should now join the server.

# Running
After these are set up, you run the bot using `node bot.js` in a command prompt in the source directory. On Windows, you can stop the bot at any time by using CTRL + C in the prompt.

# Dependency management
The commands used to produce the dependencies if you need to modify them.

* `npm install general-programming/node-sodium.git`
* `npm install bufferutil@3.0.5 uws@9.148.0 erlpack@discordapp/erlpack`
* `npm install node-opus@0.2.9 opusscript@0.0.6 libsodium-wrappers@0.7.3`
* `npm install discord.js winston fs path`

# Notes
Embeds are considered website previews, so make sure that you allow website previews in your local settings.