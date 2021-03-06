import React from "react";
import classNames from "classnames";
import styles from "./index.less";

export default ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      <div className={styles.links}>
        {
          links && links.map(link=>{
            return(
              <a
                key={link.title}
                href={link.href}
                target={link.blankTarget ? "_blank" : "_self"}>
                {link.title}
              </a>
            );
          })
        }
      </div>
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </div>
  );
}