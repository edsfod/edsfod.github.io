---
title: 示例：与 LLM 讨论：什么是函子
description: 示例：LLM 对谈整理稿，演示 AI 声明、公式、代码、表格、脚注。
draft: true
published: 2026-11-01T20:00:00+08:00
tags: [范畴论, LLM]
series: example-series
order: 1
ai:
  model: Claude Opus 5.5
---

## 起点

函子 $F: \cat{C} \to \cat{D}$ 保持复合：$F(g \circ f) = F(g) \circ F(f)$，以及 $F(\id_A) = \id_{F(A)}$。

$$
\Hom_{\cat{C}}(A, B) \cong \Hom_{\cat{C}\op}(B, A)
$$

$$
\begin{CD}
A @>f>> B \\
@VgVV @VVhV \\
C @>>k> D
\end{CD}
$$

## 代码

```ts
const fmap = <A, B>(f: (a: A) => B) => (xs: A[]) => xs.map(f);
```

| 概念 | 例子 |
|---|---|
| 范畴 | Set |
| 函子 | List |

这里有个脚注[^1]。

[^1]: 脚注内容。
