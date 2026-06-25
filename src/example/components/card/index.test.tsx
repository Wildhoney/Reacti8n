import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Locale, i18n } from "../../utils";
import { Card } from "./index";

function renderWith(locale: Locale) {
  return render(
    <i18n.Provider locale={locale}>
      <Card id="espresso" />
    </i18n.Provider>,
  );
}

describe("<Card />", () => {
  it("renders the name, description, and price for the active locale", () => {
    renderWith(Locale.En);
    expect(screen.getByTestId("coffee-espresso")).toBeInTheDocument();
    expect(screen.getByTestId("coffee-espresso-description")).toHaveTextContent(
      /concentrated shot/i,
    );
    expect(screen.getByTestId("coffee-espresso-price")).toHaveTextContent(
      "£2.50",
    );
  });

  it("switches currency and copy when the locale changes", () => {
    renderWith(Locale.Fr);
    expect(screen.getByTestId("coffee-espresso-price")).toHaveTextContent(
      /€/u,
    );
    expect(screen.getByTestId("coffee-espresso-description")).toHaveTextContent(
      /café/i,
    );
  });

  it("rounds JPY to zero decimals", () => {
    renderWith(Locale.Ja);
    expect(screen.getByTestId("coffee-espresso-price")).toHaveTextContent(
      /^￥3$/u,
    );
  });
});
