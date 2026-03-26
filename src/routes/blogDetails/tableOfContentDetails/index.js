"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./tableOfContentDetails.module.scss";
import { Marked } from "marked";
import classNames from "classnames";

function FaqChevronIcon() {
  return (
    <svg className={styles.chevron} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 9L12 13L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TableOfContentDetails({ BlogDetail }) {
  const [activeContent, setActiveContent] = useState("");

  const markdown = BlogDetail?.attributes?.blogDetails || "";

  const slugify = (text = "") => {
    return String(text)
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const headings = useMemo(() => {
    const lexerMarked = new Marked();
    const tokens = lexerMarked.lexer(markdown);
    const result = [];
    const walkTokens = (tokenList = []) => {
      tokenList.forEach((token) => {
        if (token.type === "heading" && (token.depth === 1 || token.depth === 2)) {
          const safeText = token.text || "";
          result.push({
            text: safeText,
            level: token.depth,
            slugID: slugify(safeText),
          });
        }
        if (token.tokens && Array.isArray(token.tokens)) {
          walkTokens(token.tokens);
        }
      });
    };
    walkTokens(tokens);
    return result;
  }, [markdown]);

  const renderedHtml = useMemo(() => {
    const instance = new Marked();
    const renderer = {
      heading(token) {
        const text = token?.tokens?.length ? this.parser.parseInline(token.tokens) : token?.text || "";
        const slugID = slugify(text);
        return `<h${token.depth} dir="auto" title="${text}" id="${slugID}">${text}</h${token.depth}>`;
      },
      table(token) {
        const headerHtml = token.header?.map((cell) => `<th>${this.parser.parseInline(cell.tokens || [])}</th>`).join("") || "";
        const bodyHtml =
          token.rows
            ?.map((row) => {
              const cells = row.map((cell) => `<td>${this.parser.parseInline(cell.tokens || [])}</td>`).join("");
              return `<tr>${cells}</tr>`;
            })
            .join("") || "";
        return `<div class="blogtable"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      },
    };
    instance.use({ renderer });
    return instance.parse(markdown);
  }, [markdown]);

  const handleScroll = (e, slugID) => {
    if (e) e.preventDefault();
    const element = document.getElementById(slugID);
    if (!element) return;
    const headerHeight = 95;
    window.scrollTo({
      top: element.offsetTop - headerHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 95;

      let currentActive = "";

      for (const heading of headings) {
        const element = document.getElementById(heading.slugID);
        if (!element) continue;

        const elementTop = element.offsetTop - headerHeight - 20;

        if (scrollPosition >= elementTop) {
          currentActive = heading.slugID;
        }
      }

      setActiveContent(currentActive);
    };

    window.addEventListener("scroll", handleWindowScroll);
    handleWindowScroll();

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [headings]);

  const [isActive, setIsActive] = useState(null);

  const handleToggle = (index) => {
    setIsActive((current) => (current === index ? null : index));
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <div className={styles.tableOfContentDetails}>
      <div className="container-xs">
        <div className={styles.grid}>
          <div className={styles.tocColumn}>
            <div className={styles.tableofContent}>
              <h2>Table of Contents</h2>

              {headings.map((heading, index) => (
                <span
                  key={`${heading.slugID}-${index}`}
                  onClick={(e) => handleScroll(e, heading.slugID)}
                  className={activeContent === heading.slugID ? styles.active : ""}
                >
                  {heading.text}
                </span>
              ))}
            </div>
          </div>
          <div
            className={styles.blogContent}
            dangerouslySetInnerHTML={{
              __html: renderedHtml,
            }}
          />
          {BlogDetail?.attributes?.Blog_FAQ?.length ? (
            <div className={styles.faqMainBox}>
              {BlogDetail?.attributes?.Blog_FAQ?.map((faqItem, index) => {
                const open = isActive === index;
                return (
                  <div
                    key={faqItem?.id ?? `${faqItem?.question ?? "faq"}-${index}`}
                    className={classNames(styles.lineBox, open ? styles.active : "")}
                  >
                    <div
                      className={styles.faqHeader}
                      onClick={() => handleToggle(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={open}
                    >
                      <p>{faqItem?.question}</p>
                      <div className={classNames(styles.arrow, open ? styles.arrowOpen : "")}>
                        <FaqChevronIcon />
                      </div>
                    </div>
                    <div className={classNames(styles.faqBody, open ? styles.show : styles.hide)}>
                      <div className={styles.spacer}>
                        <p>{faqItem?.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
