# Steps to follow to run this code on your own

Follow these steps to run this code and start clearing up some of your company's jargon!

## Part 0: Pre requisites
1. Your server will need to be publicly accessible via the internet.
    - Consider using [`ngrok`](https://api.slack.com/tutorials/tunneling-with-ngrok) if you're testing this out from your local machine.
        - For example, if you will be running this bot locally on the default port of 3000, you can run `ngrok http 3000` and you'll get a `https://x.ngrok.io` forwarding URL. Subsitute `x.ngrok.io` for all references of `your-host` in the rest of this document

1. You'll need the following installed on your server.
    - NodeJS and it's package manager `npm`

2. Download this codebase (using `git clone`, for example)

## Part 1: Setup your Slack app 

In your preferred web browser:

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)

2. Go to **Interactivity & Shortcuts** 
    - Enable Interactivity
    - Enter your Interactivity Request URL: `https://your-host/slack/events`
    - Create a new Shortcut
      - Select **Global** shortcut
      - Choose a descriptive name and description for your shortcut, for example:
        - Name: Search for a definition
        - Description: Search Define
      - For the Callback ID, it is important you set it to `shortcuts_phrase_search`
    - Enter your Select Menus Options Load URL `https://your-host/slack/events`


3. Go to **OAuth & Permissions** to add a bot scope
    - Under **Redirect URLs**
      - Add `https://your-host/app_installed`
      - Click Save URLs
    - Under Scopes and **Bot Token Scopes**, 
        - Add `commands` so we can add a shortcut and a slash command
        - Add `users:read` so that we can lookup the user that executes commands

5. If you plan to install your application to more than one workspace, go to **Manage Distribution** and activate public distribution

6. Go back to your new app's **Basic Information** page. We'll need to grab values from it in the next part.


## Part 2: Configure and start your app

### Docker
```
docker pull ghcr.io/slackapi/definition-app:latest
```

### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/slackapi/definition-app)

The following steps will use a combination of your server's command line and a web browser:

1. Populate your `.env` file with the contents of `.env.example` but with your own values.
    ```
    SLACK_CLIENT_ID=
    SLACK_CLIENT_SECRET=
    SLACK_SIGNING_SECRET=
    APPROVED_WORKSPACES=
    APPROVED_ENTERPRISES=
    DB_HOSTNAME=
    DB_USERNAME=
    DB_NAME=
    DB_PASSWORD=
    BLOCK_GUEST_USAGE=
    ```
    - `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET` can be found on your new application's **Basic Information** page
    - `APPROVED_WORKSPACES`, and `APPROVED_ENTERPRISES` are the **Workspace** or **Enterprise** ID of the Workspace or Enterprise Grid you want to install the application to. This prevents other workspaces installing the app.
    - `DB_HOSTNAME`, `DB_USERNAME` etc are the **MySQL credentials** for the database that will store your definitions.
    - `BLOCK_GUEST_USAGE` - By default the tool will allow Multi-Channel Guests to access your definitions. If you set this to `true`, guests will be prevented from querying the tool.


2. Run `npm install` to install code-level dependencies such as Bolt for Javascript etc.

3. Start your application! You have two options:
    - `npm start` will start your application in normal mode

    At this point, your application should be accessible at `https://your-host`.
    
    If you're using ngrok, you'll want to start your tunnel with `ngrok http 3000` (adding `-subdomain your-subdomain` if you have a paid Ngrok account)

    You can verify that your server is up and accessible by going to `https://your-host/` in your browser. If you see an 'Install' Button, you are good to go!


## Part 3: Install and use your app

Back in your preferred web browser...

1. Install your app by visiting [`https://your-host/`](https://your-host/) and clicking the 'Install' button. 

2. Try out your app! Execute your shortcut by entering "Search for a definition" in the quick switcher (CMD+k) or by using the lightning bolt ⚡️ symbol right below the message input field in Slack and filling out the form. You should see a modal appear. There's no definitions by default, but go ahead and add some!
