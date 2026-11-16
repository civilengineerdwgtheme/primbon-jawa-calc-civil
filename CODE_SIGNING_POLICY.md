# Code signing policy

Project: Primbon Jawa & Calc Civil
Source repository: https://github.com/civilengineerdwgtheme/primbon-jawa-calc-civil

Free code signing provided by SignPath.io, certificate by SignPath Foundation.

## Responsibility

The repository owner, `@civilengineerdwgtheme`, maintains the source code and build workflow and is responsible for release decisions and approval of signing requests. Contributions from others must be reviewed by the maintainer before they are included in a release build.

## Release integrity

Release binaries are built from this public repository through GitHub Actions. The unsigned build artifact is submitted to SignPath for signing only after the source revision and release version have been reviewed. The signed artifact is checked before distribution. Signing credentials are stored only in the CI provider's secret storage and are never committed to this repository.

## Privacy

Core calculations run locally. Optional online features and the in-app browser connect to the services selected or described in the application. AI prompts leave the device when the AI feature is used. See [PRIVACY.md](PRIVACY.md) for details and the relevant service providers' privacy terms.

## Scope

The SignPath Foundation certificate identifies SignPath Foundation as the signer/publisher shown by the certificate. It does not transfer copyright or ownership of this project. Project code is licensed under MIT as described in [LICENSE](LICENSE); third-party content and services remain subject to their own terms, as described in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).