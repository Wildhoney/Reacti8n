import { css } from "@emotion/css";

import { font, size } from "../../theme";

export const emoji = css`
  font-size: ${font.size.xl};
`;

export const description = css`
  && {
    min-height: ${size.cardDescription.minHeight};
  }
`;

export const price = css`
  font-size: ${font.size.l};
`;
