---
title: Formatting an input element while working in it
author: Ben Koop
pubDatetime: 2023-03-10T20:26:31Z
postSlug: input-auto-format
featured: true
draft: true
tags:
  - HTML
  - TypeScript
  - input
description: We see them, and some people have made them, but what exactly goes into a good auto formatting input element
---

I will bet you all have used/seen an auto formatting input on a webpage, have you ever written one though? While the overall steps are simple, there are many pitfalls

## Types of inputs

There are two main types of HTML elements that can be used for auto formatting: input elements and content editable div elements.
Input elements are the most common form of input used in web forms. They are simple to use and provide a straightforward way for
users to input data. Content editable div elements, on the other hand, provide more flexibility and control over the input data.
They allow for rich text formatting, but can be more complex to implement.

### When would you use one or the other?

So i would generally default to an input first, it is already handling all the eventing needed for the system for you. However, if you want to handle
more than just plain text, then they limit you fairly heavily. This is where content editable can be super useful and powerful.

## Types of auto formatting

One of the main decisions you will need to make when building an auto-formatting input is whether to use live formatting or formatting onBlur.
Live formatting updates the formatting of the input as the user types, while formatting onBlur updates the formatting when the input loses focus.
Live formatting provides immediate feedback to the user and can make it easier to correct mistakes. However, it can be more difficult to implement
and can lead to issues such as cursors jumping around and edits not doing as the user expected. Formatting onBlur is simpler to implement, but the
user may need to correct mistakes after they have finished typing.

## Common problems

There are several common problems that can arise when building an auto-formatting input. One of the most common is the cursor jumping around as the user types.
This can be caused by the formatting script modifying the input value, which can change the cursor position. To avoid this, you should also adjust the cursor
position to be in the same (relative) position it was. This is the most common problem i have seen with self implimented auto formatting inputs.

Another common problem is edits removing valuable data. This can occur when the formatting script is too strict and does not allow for variations in the input.
For example, if the input is formatted as a phone number, the script may not allow for different area codes or international number formats.
To avoid this, you should make the formatting script flexible enough to handle variations in the input.

Performance could also be a problem, however in my experience that only happens on either a very large input, where it is trying to format more than it should each
keystroke, or an overly complicated formatter that is very CPU intensive. It is difficult to be overly CPU intensive on a standard input size entry, since they can
only type so fast and you wont be doing this on multiple inputs at the same time, it is not something i'd activly worry about, and just pay attention to.

The other thing to think/worry about is what value is actually being outputted to your form. a formatted number is very nice for humans,
437867965345 is much harder to read than 437,867,965,345. however if your form is expecting a number, this can cause other issues.
