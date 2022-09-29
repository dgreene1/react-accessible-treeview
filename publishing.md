# Publishing React-Accesible-Treeview using np

Before you start publishing you should login npm registry, in your command line run `npm login`

Here it will ask for you username, password, 2FA, and public email. After you are sign in you can get started.

Np :
First install np by running: `npm install --global np`

When you are ready to publishing do the following on master branch:

1. Run `npm i` and `npm build` to ensure the code is ready to be publish

2. Make sure your local working tree is clean.

3. Run `np`. It will bring up any new file or files it would not publish and ask you promptly if that okay. Review and accept or reject.

4. Next, it will then ask what semver increase you would like to do, major, minor, patch, and etc. Choose accordingly.

5. It will start the process of publishing, when it reach publishing package using npm, it will ask for you OTP. Open your authenticator app and enter the code.

6. You have successfully publishing. Np will open up a new tab with the release note on github. Review and edit with any change you will like. Submit the changes then your release is up and ready.

7. Np will try to push the bump to master but because it is branch protected, it will not be able to. In this case you can cherrypick the commit to a new branch. You should also update the website/package.json to use the new release version. Lastly, create a PR for this version bump. NOTE: If you need to reset the commit that np did, run \$ git reset --hard HEAD^ in master.
