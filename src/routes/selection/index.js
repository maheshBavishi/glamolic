import React from "react";
import styles from "./selection.module.scss";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import Link from "next/link";
const ImageGenIcon = "/assets/images/selection-image.webp";

export default function Selection() {
  return (
    <div className={styles.categorySelection}>
      <div className="container-md">
        <div className={styles.boxCenteralignment}>
          <div className={styles.boxHeaderAlignment}>
            <h2>Glamolic Selection</h2>
            <p>Select a generation type to get started</p>
          </div>
          <div className={styles.boxDesign}>
            <div className={styles.grid}>
              <div className={styles.griditems}>
                <div className={styles.image}>
                  <img src={ImageGenIcon} alt="Image Generation" />
                </div>
                <div className={styles.details}>
                  <h4>Image</h4>
                  <ul>
                    <li>High Quality</li>
                    <li>Fast Generation</li>
                    <li>Custom Styles</li>
                  </ul>
                  <Link href="/category-selection">
                    <button>
                      Explore Image
                      <RightWhiteIcon />
                    </button>
                  </Link>
                </div>
              </div>
              <div className={styles.griditems}>
                <div className={styles.image}>
                  <video autoPlay loop muted playsInline width="100%" height="100%">
                    <source src="/assets/video/demo-video.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className={styles.details}>
                  <h4>Video</h4>
                  <ul>
                    <li>Smooth Animation</li>
                    <li>Creative Concepts</li>
                    <li>Dynamic Content</li>
                  </ul>
                  <Link href="/video-generation">
                    <button>
                      Explore Video
                      <RightWhiteIcon />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
