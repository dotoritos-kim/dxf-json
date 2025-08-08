# Contributing

```
npm i
```

> [!NOTE] 
> `analyze` command uses graphviz `dot`. You may have to install it manually, depends on your environment. For more information, checkout https://www.graphviz.org/download/

Welcome! Thank you for your will of open source contribution. Please read the following description when you contribute your work.

## Discuss First Before Work

Please open an issue and discuss the change you wish to make, before you open pull request.

## Branch Strategy

- `dxf-json` use branch strategy similar to [git flow](https://www.gitkraken.com/learn/git/git-flow), but we merge `dev` into `main` directly
- If your work is based on branch `X`, then your destination also should be `X`
  - The only exception is minor release, but it's administrator exclusive feature.
- Any **small fix of severe bug(s)** should be based on `main`
- Any **new feature** must be based on `dev`
- Any **huge changes** or refactoring must be based on `dev`
- Any changes of `README` and `CONTRIBUTING.md` should be `main`
- If you're not sure, feel free to ask to us on issue page.

### Merge Policy

- Use `Merge Commit` if you have more than one commits in your branch.
- Use `Squash Commit` if you have single commit only.

## Versioning

`dxf-json` uses [Sementic Versioning](https://semver.org/), but until v1.0.0, any breaking changes may occurs at any versions. Also version is automatically tagged using github action, based on your pull request title.

- Start with `feat: ` when you introduce new feature to user
- Start with `fix: ` when you fix any bug or abnormally.
- Start with `docs: ` when you change only document.
- Start with `chore: ` otherwise (usually CI related works)

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project 

Our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces, when an individual is representing the project or its community. 

Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. 

Representation of a project may be further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at wwponv158@gmail.com. All
complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. 

The project team is obligated to maintain confidentiality with regard to the reporter of an incident.

Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or permanent repercussions as determined by other members of the project's leadership.

:)
