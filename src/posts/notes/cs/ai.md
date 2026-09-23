---
lang: en-US
title: AI Learning Notes
description: AI mathematics, programming and theory
date: 2024-06-19
category:
  - Math
tag:
  - AI
---

## Machine Learning

### Supervised Learning

Supervised learning learns a **mapping f from input X to output Y** from a set of **labeled examples** (x_i, y_i). The label y is the *supervision signal*: it tells the model the expected answer for each sample, so training is essentially "correcting the model by comparing its prediction y_hat = f(x) with the true y". The samples are assumed to be drawn i.i.d. from an unknown joint distribution P(X, Y), and the real goal is to minimize the **expected loss** E[L(f(X), Y)] over that distribution. Since P(X, Y) is unknown, we can only minimize the **empirical risk** on the finite training set — which is why supervised training tends to overfit, and why **regularization** (structural risk minimization, SRM) is usually required on top of pure ERM.

Training is a closed loop: forward pass → compute the loss → backpropagate gradients → update parameters with an optimizer, repeated over many epochs. The loss is chosen to match the task; under an explicit assumption about the noise/model it coincides with the **negative log-likelihood** derived from maximum likelihood estimation (MLE).

Supervised tasks are usually divided by the type of label:

- **Regression** — Y is continuous. The model outputs a real number, trained with a continuous loss such as MSE or MAE. Typical algorithms: linear regression, decision trees / GBDT, neural network regressors. Applications: house-price, temperature or sales forecasting.

- **Classification** — Y is a discrete category. It covers binary, multi-class and multi-label settings; the output layer converts raw scores (logits) into probabilities via sigmoid (independent labels) or softmax (mutually exclusive classes), trained with cross-entropy. Typical algorithms: logistic regression, SVM, k-NN, tree ensembles, neural networks. Applications: spam detection, image recognition, sentiment analysis.

Labels are not limited to a scalar: *structured-output* tasks such as sequence labeling, machine translation and object detection also fit the supervised paradigm.

Representative algorithms span classical methods (linear/logistic regression, SVM, k-nearest neighbors, decision trees and their ensembles such as random forest and GBDT) and deep networks (MLP, CNN, RNN, Transformer-based models). What unifies them is the training paradigm, not the architecture: the same network can be trained in a supervised way on one task and unsupervised on another.

Common misconceptions:

- **"Supervised" describes the training data/paradigm, not the model.** In modern deep learning a model is usually first *self-supervised* pretrained on unlabeled text or images, then *supervised* fine-tuned on labels — the architecture never changes.

- **Label quality sets the performance ceiling.** Supervision is the only signal carrying information about the target; noisy or mislabeled data directly caps accuracy and cannot be fully compensated by a larger model.

- **The i.i.d. assumption can silently break.** Supervised learning assumes deployment data follows the training distribution. Under distribution shift or concept drift, validation accuracy no longer predicts production behavior.

### Unsupervised Learning

Unsupervised learning handles data with **no labels — only inputs X**. Instead of predicting a target, it aims to discover structure: groups, low-dimensional representations, or the shape of the underlying distribution P(X). From an information-theoretic viewpoint, supervised learning estimates the conditional distribution P(Y|X), while unsupervised learning compresses and summarizes P(X) itself — the model receives no "right or wrong" feedback at all.

Typical problem families and representative algorithms:

- **Clustering** — partition samples so that points in the same group are similar and points in different groups are dissimilar. Algorithms: K-means (prototype-based, favors spherical clusters), hierarchical clustering, DBSCAN (density-based, handles arbitrary shapes and noise), Gaussian Mixture Models (soft, probabilistic assignment). Applications: customer segmentation, image compression, grouping related documents.

- **Dimensionality reduction & representation learning** — map data into a lower-dimensional space while preserving as much information as possible. Linear: PCA / SVD (keep the directions of maximum variance); visualization-oriented: t-SNE, UMAP; neural: autoencoders (minimize reconstruction error). Uses: feature compression, denoising, visualization, and generating embeddings for similarity search.

- **Density estimation & anomaly detection** — explicitly model P(X) (e.g., GMM, kernel density estimation); points falling in very low-probability regions are flagged as anomalies or outliers.

- **Self-supervised learning — the blurred line in the deep learning era.** What is loosely called "unsupervised pretraining" today is usually *self-supervised*: the data itself generates pseudo-labels via a pretext task (e.g., BERT's masked language modeling, contrastive learning), and the model is then trained with ordinary supervised machinery. This learns representations without human annotation, but it is not the classic "discover the structure of P(X)" setting — a distinction that is easy to confuse and frequently asked about in interviews.

Difficulties and common misunderstandings:

- **No ground truth ⇒ no universal metric.** Without labels, "error" is undefined, so the model cannot be scored by accuracy. Quality is judged only by internal heuristics (within-cluster SSE, silhouette score, reconstruction loss), downstream task performance, or manual inspection — which is why unsupervised results are harder to compare objectively.

- **A clustering result is not the "true" grouping of the data.** The partition depends on the chosen distance metric, feature representation, and hyperparameters such as the number of clusters K. The same dataset can yield several different but equally useful groupings depending on the goal — clustering outputs are *useful*, not *correct*.

- **Unsupervised learning creates no information.** It can only expose structure already implied by the data and the chosen features. With too little or unrepresentative data it still underfits or overfits (e.g., a large K in K-means can fit pure noise). And since there are no labels, it cannot directly answer a predictive question: to predict an unseen target, labels must be introduced, which is why unsupervised methods are usually combined with a later supervised or self-supervised stage.
