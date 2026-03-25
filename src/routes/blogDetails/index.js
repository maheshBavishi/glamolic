import React from 'react'
import styles from './blogDetails.module.scss';
import BlogInformation from './blogInformation';
import TableOfContentDetails from './tableOfContentDetails';
export default function BlogDetails() {
    return (
        <div>
            <BlogInformation />
            <TableOfContentDetails />
        </div>
    )
}
