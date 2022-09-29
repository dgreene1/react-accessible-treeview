# Publishing react-accessible-treeview

You should use [np](https://github.com/sindresorhus/np#np-) to publish react-accessible-treeview. 

Before you start publishing you should login to the npm registry by running `npm login` in your command line run.  You will be asked for your username, password, 2FA, and public email.

After you have an authenticated session, it is recommended that you install np by running `npm install --global np` in your command line.

After you have completed these two preliminary tasks and you are ready to publish a new package, you should executing the following steps:

1. When on the master branch, run `npm i` and `npm build` to ensure the code is ready to be publish.
2. Make sure your local working tree is clean.
3. Run `np`. This will list any new file(s) it would not publish and ask if you are OK with that. Review and accept or reject.
4. Next, it will ask what semver increase you would like to do (major, minor, patch). Choose accordingly.
5. It will then start the process of publishing.  When it reaches the point when it is ready to actually publish the package to npm, it will ask for a OTP (one-time password). Open your authenticator app and enter the code.
6. Upon completion, your package will have successfully been published to npm. np will open up a new tab with the release notes on GitHub where you will have the opportunity to review/edit. Submit the changes to finalize the release.
7. np will try to push a bump commit to master, but, because it is a protected branch, this action will not be possible. Instead, you can cherrypick the commit to a new branch. You should also update the website/package.json to use the new release version. Lastly, create a PR for this version bump. NOTE: If you need to reset the commit that np did, run `git reset --hard HEAD^` in master.
