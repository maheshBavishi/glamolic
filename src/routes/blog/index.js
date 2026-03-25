import React from 'react'
import styles from './blog.module.scss';
import BlogBanner from './blogBanner';
import BlogCardview from './blogCardview';
export default function Blog() {
    return (
        <div>
            <BlogBanner />
            <BlogCardview />
        </div>
    )
}
