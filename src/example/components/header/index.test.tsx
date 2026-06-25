import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Locale, i18n } from "../../utils";
import { Header } from "./index";

function renderWith(locale: Locale) {
  return render(
    <i18n.Provider locale={locale}>
      <Header />
    </i18n.Provider>,
  );
}

describe("<Header />", () => {
  it("renders the localized title, tagline, and language label", () => {
    renderWith(Locale.En);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Tradurre · Coffee Menu",
    );
    expect(screen.getByText(/type-safe i18n/i)).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  it("switches all copy when the locale changes", () => {
    renderWith(Locale.Ja);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "コーヒーメニュー",
    );
    expect(screen.getByText("言語")).toBeInTheDocument();
  });
});
