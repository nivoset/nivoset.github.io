---
title: Formatting an input element while working in it
author: Ben Koop
pubDatetime: 2023-03-12T20:26:31Z
postSlug: input-auto-format
featured: true
draft: false
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

So I would generally default to an input first, it is already handling all the eventing needed for the system for you. However, if you want to handle
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
position to be in the same (relative) position it was. This is the most common problem I have seen with self implimented auto formatting inputs.

Another common problem is edits removing valuable data. This can occur when the formatting script is too strict and does not allow for variations in the input.
For example, if the input is formatted as a phone number, the script may not allow for different area codes or international number formats.
To avoid this, you should make the formatting script flexible enough to handle variations in the input.

Performance could also be a problem, however in my experience that only happens on either a very large input, where it is trying to format more than it should each
keystroke, or an overly complicated formatter that is very CPU intensive. It is difficult to be overly CPU intensive on a standard input size entry, since they can
only type so fast and you wont be doing this on multiple inputs at the same time, it is not something I'd activly worry about, and just pay attention to.

The other thing to think/worry about is what value is actually being outputted to your form. a formatted number is very nice for humans,
437867965345 is much harder to read than 437,867,965,345. however if your form is expecting a number, this can cause other issues.

## Lets work on a number format input.

I will write some of this in more simplistic JSX looking code for simplicity, however I will always try to be explanatory.

So next we will work on a basic number formatter. this is a very simple but useful case where you want to add in the comma between the digit groups. This is where
knowing what the browser can do now will help.

First. how should we call the code? I prefer more uncontrolled things where there isn't a need to over complicate and add more internal code. in this case I will use the `onInput` handler on the input itself. So this is an Input event, however; to give a little more vanilla idea on this, just saying it is an event.

```tsx
export function Input(props: HTMLInputProps) {
  const onInput = function(e: Event) {
    // co-erce into e.target being a HTML Input element for typescript
    if (!(e.target instanceof HTMLInput)) {
      return
    }
    // just referencing to the input element here
    const input = e.target;

    // So this is where the magic happens. we will go over this later
    const [formatted, position] = formatNumberWithCursor(input.value, input.selectionStart ?? input.value.length);

    // once I get the formatted data, I set the data back on this
    e.target.value = formatted;
    // as well as an updated cursor positon. this is key to help avoid problems with users
    e.target.setSelectionRange(position, position);
  }
  <input {...props} onInput={onInput}/>
}
```

So then what does this function do?

```typescript
const decimal = ".";
// regex to get only numeric type values, we use this to select all other values
const selectOnlyNonNumericCharacters = /[^0-9.-]/g;

function formatNumberWithCursor(
  input: string,
  cursorPosition: number,
  locale: string = "en-US", // for internationalization
  precision = 2 // decimal size
): [string, number] {
  // If you try to clean up with the decimal in the last place, it will remove the decimal
  // when better support should probably move to https://caniuse.com/mdn-javascript_builtins_string_at
  if (
    input.charAt(input.length - 1) === decimal ||
    input.split(decimal).length === 2
  ) {
    return [input, cursorPosition];
  }
  // Remove non-numeric characters from the input string
  const numericString = input.replace(selectOnlyNonNumericCharacters, "");
  if (!numericString.trim()) {
    return [numericString.trim(), cursorPosition];
  }

  // Format the numeric string using the Intl.NumberFormat formatter
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  const formattedString = formatter.format(parseFloat(numericString));

  // start code to update cursor position
  const rawBeforeStart = input.slice(0, cursorPosition);
  const valueBeforeCursor = rawBeforeStart.replace(
    selectOnlyNonNumericCharacters,
    ""
  );

  // so looking at the formatted string, and try to see if we can match it up with the original strings value before the cursor.
  // this isn't the most performant way, though it is i think the easiest and most understanable.
  for (let cursor = 0; cursor < formattedString.length; cursor++) {
    // we format the substring to be able to easily compare.
    const formattedVal = formattedString
      .substring(0, cursor)
      .replace(selectOnlyNonNumericCharacters, "");
    if (formattedVal === valueBeforeCursor) {
      return [formattedString, cursor];
    }
  }
  // catchall that i couldn't find it, then i revert to putting the cursor at the end
  return [formattedString, formattedString.length];
}
```

Notes are always a useful thing for yourself, and also to help break downw hat each bit of code does. if the chunks get too big, I normally refactor them out. however I think this makes this more readable for now.
