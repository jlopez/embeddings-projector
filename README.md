# Embeddings Projector [![Build](https://github.com/jlopez/embeddings-projector/actions/workflows/build.yml/badge.svg)](https://github.com/jlopez/embeddings-projector/actions/workflows/build.yml)

### Embedding Projector

The Embedding Projector allows you to visualize high-dimensional data; for
example, you may view your input data after it has been embedded in a high-
dimensional space by your model. The embedding projector reads data from your
model checkpoint file, and may be configured with additional metadata, like
a vocabulary file or sprite images. For more details, see [the embedding
projector tutorial](https://www.tensorflow.org/tutorials/text/word_embeddings).

### Developing

After cloning the project, install all dependencies

```shell
$ npm i
```

Launch the compile service

```shell
$ npm run watch
```

If you need the mock AI bot see the [section](#ai-bot). Otherwise make sure there
is a valid chatbotUrl set in the projector settings (top bar, gear icon)

Enable the "Live Server" plugin on VSCode. Then launch the server by pressing the
"Go Live" button in the status bar, bottom right.

Finally, navigate to the "Run and Debug" pane on the left, select the "chrome" target
and start a session. This should launch Chrome running the projector. You may set
breakpoints on the sources inside chrome and the breakpoints will hit on both the
browser and VSCode. For some reason, breakpoints set from VSCode don't work yet.

Modify any code and save. The browser will reload the projector.

### AI Bot

A simple mock AI bot is provided:

```shell
$ python tools/ai-bot.py
```

Before using make sure to accept the self-signed certificate by [navigating to it](https://127.0.0.1:5000)
and following the instructions.
