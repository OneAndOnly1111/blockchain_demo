import React from "react";
import styles from "./index.less";

export default ({ links, copyright }) => {
  return (
    <div className={styles.globalFooter}>
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