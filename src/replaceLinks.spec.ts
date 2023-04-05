import { getRegExp } from "./replaceLinks";

describe("replaceLinks", () => {
  describe("RegExp", () => {
    it("should match a gif file", () => {
      const inputString = "![TimeInput Firefox](./img/time-input-firefox.gif)";
      const gifFileName = "time-input-firefox.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual([
        "![TimeInput Firefox](./img/time-input-firefox.gif)",
      ]);
    });

    it("should not match a plain link", () => {
      const inputString =
        "[write your own Input component](./Inputs.md#writing-your-own-input-component)";
      const gifFileName = "Inputs.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual(null);
    });

    it("should not match a gif file with another name", () => {
      const inputString = "![TimeInput Firefox](./img/time-input-edge.gif)";
      const gifFileName = "time-input-firefox.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual(null);
    });

    it("should not match a jpg file", () => {
      const inputString = "![TimeInput Firefox](./img/time-input-firefox.jpg)";
      const gifFileName = "time-input-firefox.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual(null);
    });

    it("should match several gifs on the same line", () => {
      const inputString =
        "| ![TimeInput Firefox](./img/time-input-firefox.gif) | ![second TimeInput Firefox](./img/time-input-firefox.gif) |";
      const gifFileName = "time-input-firefox.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual([
        "![TimeInput Firefox](./img/time-input-firefox.gif)",
        "![second TimeInput Firefox](./img/time-input-firefox.gif)",
      ]);
    });

    it("should match several gifs on multiple lines", () => {
      const inputString = `
# \`<TextInput>\`

\`<TextInput>\` is the most common input. It is used for texts, emails, URL or passwords. In translates into [an MUI \`<TextField>\`](https://mui.com/material-ui/react-text-field/), and renders as \`<input type="text">\` in HTML.

![TextInput](./img/text-input.gif)

## \`resettable\`

You can make the \`<TextInput>\` component resettable using the \`resettable\` prop. This will add a reset button which will be displayed only when the field has a value and is focused.

![second TextInput](./img/text-input.gif)
        `;
      const gifFileName = "text-input.gif";
      const regExp = RegExp(getRegExp(gifFileName), "g");
      const match = inputString.match(regExp);
      expect(match).toEqual([
        "![TextInput](./img/text-input.gif)",
        "![second TextInput](./img/text-input.gif)",
      ]);
    });

    it("should return the gif file path as first capture group", () => {
      const inputString = "![TimeInput Firefox](./img/time-input-firefox.gif)";
      const gifFileName = "time-input-firefox.gif";
      const regExp = RegExp(getRegExp(gifFileName));
      const match = inputString.match(regExp);
      expect(match?.[1]).toEqual("./img/time-input-firefox.gif");
    });
  });
});
