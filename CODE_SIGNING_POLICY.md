# Code signing policy

Project: Primbon Jawa & Calc Civil
Source repository: https://github.com/civilengineerdwgtheme/primbon-jawa-calc-civil

Free code signing provided by SignPath.io, certificate by SignPath Foundation.

## Current status

The project has not yet received approval from the SignPath Foundation Open Source Software program. The current Windows portable executable is unsigned, and no release from this project has been signed with a SignPath Foundation certificate. This policy describes the intended process if the project is accepted.

## Responsibility

The repository owner, `@civilengineerdwgtheme`, is responsible for the project source code and release decisions. If the project is accepted, the repository owner will maintain the signing workflow and approve release signing requests. Contributions from others must be reviewed by the maintainer before they are included in a release build.

## Release integrity

If the project is accepted, the planned process is to build release binaries from this public repository through GitHub Actions, review the source revision and release version, submit the build artifact to SignPath for signing, and check the signed artifact before distribution. The workflow has not yet been configured with SignPath credentials or approved for signing. Any signing credentials will be stored only in GitHub Actions secrets and will not be committed to this repository.

## Privacy

Core calculations run locally. Optional online features and the in-app browser connect to the services selected or described in the application. AI prompts leave the device when the AI feature is used. See [PRIVACY.md](PRIVACY.md) for details and the relevant service providers' privacy terms.

## Scope

If the project is accepted into the SignPath Foundation program, the resulting certificate will identify SignPath Foundation as the signer/publisher; it will not transfer copyright or ownership of this project. Project code is licensed under MIT as described in [LICENSE](LICENSE); third-party content and services remain subject to their own terms, as described in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
