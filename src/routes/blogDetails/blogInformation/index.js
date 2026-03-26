import React from "react";
import styles from "./blogInformation.module.scss";
import DateIcon from "@/icons/dateIcon";
import moment from "moment";
const ProfileImage = "/assets/images/profile.png";
export default function BlogInformation({ BlogDetail }) {
  console.log("🚀 ~ BlogInformation ~ Author:", BlogDetail?.attributes?.Author?.authorProfile?.data?.attributes?.url)
  return (
    <div>
      <div className={styles.blogInformation}>
        <div className="container-xs">
          <div className={styles.title}>
            <h1>{BlogDetail?.attributes?.title}</h1>
            <div className={styles.profilleDateAlignment}>
              <div className={styles.profile}>
                <img src={`${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${BlogDetail?.attributes?.Author?.authorProfile?.data?.attributes?.url}` || ProfileImage} alt="ProfileImage" />
                <span>{BlogDetail?.attributes?.Author?.name}</span>
              </div>
              <div className={styles.date}>
                <DateIcon />
                <span>{moment(BlogDetail?.attributes?.createdAt).format("DD MMM, YYYY")}</span>
              </div>
            </div>
          </div>
          <div className={styles.mainImage}>
            <img src={`${process.env.NEXT_PUBLIC_CMS_IMAGE_URL}${BlogDetail?.attributes?.coverImage?.data?.attributes?.url}`} alt="Main Image" />
          </div>
        </div>
      </div>
    </div>
  );
}
