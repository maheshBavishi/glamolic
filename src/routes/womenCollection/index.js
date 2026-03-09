import React from 'react'
import styles from './womenCollection.module.scss';
import LeftIcon from '@/icons/leftIcon';
import Input from '@/components/input';
import Dropdown from '@/components/dropdown';
import ShopIcon from '@/icons/shopIcon';
import Switch from '@/components/switch';
import SettingIcon from '@/icons/settingIcon';
import ModelIcon from '@/icons/modelIcon';
import UploadPhoto from '@/components/uploadPhoto';
import RightWhiteIcon from '@/icons/rightWhiteIcon';
const PlusIcon = '/assets/icons/plus.svg';
const LineIcon = '/assets/icons/line.svg';
const DangerIcon = '/assets/icons/danger.svg';

const resolutionOptions = [
    { value: '512x512', label: '512 x 512' },
    { value: '1024x1024', label: '1024 x 1024' },
    { value: '2048x2048', label: '2048 x 2048' },
];

export default function WomenCollection() {
    return (
        <div className={styles.womenCollection}>
            <div className='container-md'>
                <div className={styles.boxCenteralignment}>
                    <div className={styles.boxHeaderAlignment}>
                        <div>
                            <h2>
                                Configure your women collection
                            </h2>
                            <p>
                                Upload your product images and customize the generation settings to create professional, on model photoshoots.
                            </p>
                        </div>
                    </div>
                    <div className={styles.settingBox}>
                        <div className={styles.title}>
                            <h3>
                                Generation Settings
                            </h3>
                        </div>
                        <div className={styles.informationBox}>
                            <Input label='Product Name' placeholder='Summer floral dress' />
                            <div className={styles.twoCol}>
                                <Dropdown label='Resolution' options={resolutionOptions} placeholder='Select resolution' />
                                <Dropdown label='Image size' placeholder='12*18 inch' />
                                <Input label='Background Type' placeholder='Professional studio' />
                                <Dropdown label='Images/Product' placeholder='2 images per product' />
                            </div>
                            <div className={styles.subbox}>
                                <div className={styles.items}>
                                    <div className={styles.icontext}>
                                        <div className={styles.icon}>
                                            <ShopIcon />
                                        </div>
                                        <div>
                                            <h5>
                                                Ecommerce Image
                                            </h5>
                                            <p>
                                                Specialized for product listings
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Switch />
                                    </div>
                                </div>
                                <div className={styles.items}>
                                    <div className={styles.icontext}>
                                        <div className={styles.icon}>
                                            <ModelIcon />
                                        </div>
                                        <div>
                                            <h5>
                                                Model Consistency
                                            </h5>
                                            <p>
                                                Keep same model across images
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Switch />
                                    </div>
                                </div>
                                <div className={styles.items}>
                                    <div className={styles.icontext}>
                                        <div className={styles.icon}>
                                            <SettingIcon />
                                        </div>
                                        <div>
                                            <h5>
                                                Unified Background
                                            </h5>
                                            <p>
                                                Same setting for all products
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Switch />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.title}>
                            <h3>
                                Product Details
                            </h3>
                        </div>
                        <div className={styles.productInformation}>
                            <Dropdown label='Clothing Type' placeholder='Select type' />
                            <div className={styles.uploadGrid}>
                                <div>
                                    <label>
                                        Font view
                                    </label>
                                    <UploadPhoto />
                                </div>
                                <div>
                                    <label>
                                        Back view
                                    </label>
                                    <UploadPhoto />
                                </div>
                            </div>
                            <div className={styles.title}>
                                <h3>
                                    Additional Instructions
                                </h3>
                            </div>
                            <div className={styles.textareaGrid}>
                                <div>
                                    <label>
                                        Image 1
                                    </label>
                                    <textarea placeholder='Instruction image 1...'></textarea>
                                </div>
                                <div>
                                    <label>
                                        Image 2
                                    </label>
                                    <textarea placeholder='Instruction image 2...'></textarea>
                                </div>
                            </div>
                            <div className={styles.addanother}>
                                <div className={styles.iconcenter}>
                                    <img src={PlusIcon} alt='PlusIcon' />
                                </div>
                                <p>
                                    Add another product
                                </p>
                            </div>
                            <div className={styles.importantMessage}>
                                <p>
                                    Please complete all required fields (at least one image) in the current product before adding another.
                                </p>
                            </div>
                            <div className={styles.estimateBox}>
                                <div className={styles.contentAlignment}>
                                    <div className={styles.leftAlignment}>
                                        <p>
                                            Estimated Cost
                                        </p>
                                        <button>
                                            4 credits
                                        </button>
                                    </div>
                                    <div className={styles.line}>
                                        <img src={LineIcon} alt='LineIcon' />
                                    </div>
                                    <div className={styles.leftAlignment}>
                                        <p>
                                            Available Balance
                                        </p>
                                        <button>
                                            2 credits
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.buttonDesign}>
                                    <button>
                                        Upgrade to Pro
                                        <RightWhiteIcon />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.noteAlignment}>
                                <div className={styles.note}>
                                    <img src={DangerIcon} alt='DangerIcon' />
                                    <p>
                                        <span>Note: </span> Generated images will be automatically deleted from history after 3 day.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
