import React from 'react'
import styles from './history.module.scss';
import Button from '@/components/button';
import ProductIcon from '@/icons/productIcon';
import ImageIcon from '@/icons/imageIcon';
import ResolutionIcon from '@/icons/resolutionIcon';
import SizeIcon from '@/icons/sizeIcon';
import StudioIcon from '@/icons/studioIcon';
import GeneratedImages from './generatedImages';
import NoteIcon from '@/icons/noteIcon';
const GenrationIcon = '/assets/icons/genration.svg';
const ProductImage = '/assets/images/product2.png';
export default function History() {
  return (
    <div>
      <div className={styles.historyPageAlignment}>
        <div className='container-md'>
          <div className={styles.boxCenter}>
            <div className={styles.boxHeaderAlignment}>
              <div>
                <h2>
                  Generation History
                </h2>
                <p>
                  Review and download your past generated collections
                </p>
              </div>
              <div>
                <Button text="New Generation" icon={GenrationIcon} />
              </div>
            </div>
            <div className={styles.detailsBox}>
              <div className={styles.detailsboxHeader}>
                <div className={styles.image}>
                  <img src={ProductImage} alt='ProductImage' />
                </div>
                <div className={styles.details}>
                  <div className={styles.chip}>
                    <span>Completed</span>
                  </div>
                  <h2>
                    AI Photoshoot
                  </h2>
                  <div className={styles.allToogleAlignment}>
                    <button>
                      <ProductIcon />
                      1 Products
                    </button>
                    <button>
                      <ImageIcon />
                      2 Images
                    </button>
                    <button>
                      <ResolutionIcon />
                      2k Resolution
                    </button>
                    <button>
                      <SizeIcon />
                      12*18
                    </button>
                    <button>
                      <StudioIcon />
                      Studio
                    </button>
                    <button>
                      <ProductIcon />
                      2 per product
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.additionalInstructions}>
                <div className={styles.icontext}>
                  <NoteIcon />
                  <h3>
                    Additional Instructions
                  </h3>
                </div>
                <div className={styles.subtitle}>
                  <h4>
                    Product 1 (Saree Catalogue)
                  </h4>
                </div>
                <div className={styles.typebox}>
                  <p>
                    Image1:
                  </p>
                  <span>
                    Ultra realistic indian saree model standing gracefully in heavy rain, full body shoot, elegant femimine expression, confident posture, wet saree 
                    naturally...
                  </span>
                </div>
              </div>
              <GeneratedImages />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
