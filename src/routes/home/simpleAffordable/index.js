"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./simpleAffordable.module.scss";
import RightWhiteIcon from "@/icons/rightWhiteIcon";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabaseClient } from "@/integrations/supabase/supabaseClient";
import { fetchPlansByCategory, formatPrice, generatePlanFeatures, getPlanName, normalizePlanCategory } from "@/services/plans-service";

const FlowerImage = "/assets/images/flower.png";
const LineBoxOne = "/assets/images/linebox1.png";
const LineBoxTwo = "/assets/images/linebox2.png";

export default function SimpleAffordable() {
  const router = useRouter();
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [activePlanTab, setActivePlanTab] = useState("regular");
  const [isProcessingPlan, setIsProcessingPlan] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const fetchedPlans = await fetchPlansByCategory();

        if (!isMounted) return;
        setPlans(Array.isArray(fetchedPlans) ? fetchedPlans : []);
      } catch (error) {
        console.error("Failed to load plans:", error);

        if (!isMounted) return;
        setPlans([]);
        toast.error("Unable to load plans right now. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoadingPlans(false);
        }
      }
    };

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const { regularPlans, endUserPlans, ecommercePlans } = useMemo(() => {
    const buckets = {
      regularPlans: [],
      endUserPlans: [],
      ecommercePlans: [],
    };
    plans.forEach((plan) => {
      const category = normalizePlanCategory(plan?.plan_category);
      if (category === "regular") {
        buckets.regularPlans.push(plan);
      } else if (category === "end_user") {
        buckets.endUserPlans.push(plan);
      } else if (category === "ecommerce") {
        buckets.ecommercePlans.push(plan);
      }
    });
    return buckets;
  }, [plans]);

  const allDisplayedPlans = activePlanTab === "regular" ? regularPlans : activePlanTab === "end_user" ? endUserPlans : ecommercePlans;

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const getCardsPerSlide = () => {
    if (window.innerWidth <= 568) return 1;
    if (window.innerWidth <= 1124) return 2;
    return 3;
  };

  const scrollByAmount = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll("[data-plan-card='true']"));
    if (cards.length === 0) return;

    const cardsPerSlide = Math.min(getCardsPerSlide(), cards.length);
    const currentScrollLeft = container.scrollLeft;

    let currentIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - currentScrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        currentIndex = index;
      }
    });

    const delta = direction === "left" ? -cardsPerSlide : cardsPerSlide;
    const maxStartIndex = Math.max(0, cards.length - cardsPerSlide);
    const targetIndex = Math.max(0, Math.min(maxStartIndex, currentIndex + delta));

    cards[targetIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    const timer = setTimeout(() => {
      updateScrollButtons();
    }, 100);
    return () => clearTimeout(timer);
  }, [activePlanTab, allDisplayedPlans.length]);

  useEffect(() => {
    const onResize = () => updateScrollButtons();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleTabChange = (tab) => {
    setActivePlanTab(tab);
  };

  const handlePlanSelect = async (plan) => {
    if (!user) {
      toast.error("Please log in to upgrade your plan");
      router.push("/login");
      return;
    }
    setSelectedPlanId(plan?.id ?? null);
    setIsProcessingPlan(true);
    try {
      const { data, error } = await supabaseClient.functions.invoke("create-order", {
        body: {
          credits: plan?.credits,
          price: plan?.price,
          currency: plan?.currency_type,
          planName: getPlanName(plan?.display_name),
          user_email: user?.email,
          customer_name: user?.name,
          customer_phone: user?.phone,
        },
      });
      if (data?.payment_url) {
        window.open(data.payment_url, "_blank", "noopener,noreferrer");
      } else {
        toast.error(data?.message || "Unable to create your order right now.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Something went wrong while creating your order. Please try again.");
    } finally {
      setIsProcessingPlan(false);
      setSelectedPlanId(null);
    }
  };

  return (
    <div className={styles.simpleAffordable} id="pricing">
      <motion.div
        className={styles.leftVec}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <img src={LineBoxOne} alt="LineBoxOne" />
      </motion.div>

      <motion.div
        className={styles.bottom}
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <img src={LineBoxTwo} alt="LineBoxTwo" />
      </motion.div>

      <div className="container">
        <motion.div
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Simple, Affordable & Scalable</h2>
        </motion.div>

        <motion.div
          className={styles.groupButtonCenter}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className={styles.groupButton}>
            <button type="button" onClick={() => handleTabChange("regular")} className={activePlanTab === "regular" ? styles.active : ""}>
              Regular Plans
            </button>

            <button type="button" onClick={() => handleTabChange("end_user")} className={activePlanTab === "end_user" ? styles.active : ""}>
              End User Plan
            </button>

            <button type="button" onClick={() => handleTabChange("ecommerce")} className={activePlanTab === "ecommerce" ? styles.active : ""}>
              Ecommerce Plan
            </button>
          </div>
        </motion.div>

        {isLoadingPlans ? (
          <div className={styles.loadingState}>
            <div className={styles.loader}></div>
            <p>Loading plans...</p>
          </div>
        ) : (
          <div className={styles.carouselWrap}>
            <motion.div
              key={activePlanTab}
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className={styles.grid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {allDisplayedPlans.length === 0 ? (
                <div className={styles.emptyState}>No plans available for this category right now.</div>
              ) : (
                allDisplayedPlans.map((plan, index) => {
                  const credits = Number.parseInt(String(plan?.credits || "0"), 10);
                  const safeCredits = Number.isNaN(credits) ? 0 : credits;
                  const features = generatePlanFeatures(plan);
                  const isPopular = index === 1;
                  const isCurrentPlanProcessing = isProcessingPlan && selectedPlanId === plan?.id;

                  return (
                    <div className={styles.cardSlide} data-plan-card="true" key={plan?.id || index}>
                      <motion.div
                        className={`${styles.items} ${isPopular ? styles.popularItem : ""}`}
                        variants={cardVariants}
                        whileHover={{ y: -10 }}
                      >
                        {isPopular && (
                          <div className={styles.popularBadge}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 2H6c-1.103 0-2 .897-2 2v2c0 1.954 1.487 3.561 3.393 3.903C8.163 11.411 10.329 12 12 12s3.837-.589 4.607-2.097C18.513 9.561 20 7.954 20 6V4c0-1.103-.897-2-2-2zm-12 4V4h1v2c0 .903-.385 1.716-1 2.275V6.275c-.583-.456-1-1.161-1-1.936V4h1zM18 8.275c-.615-.559-1-1.372-1-2.275V4h1v2c0 .775-.417 1.48-1 1.936v.339zM12 14c-2.206 0-4 1.794-4 4v2h8v-2c0-2.206-1.794-4-4-4z" />
                            </svg>
                            {activePlanTab === "ecommerce" ? "Best Value" : "Most Popular"}
                          </div>
                        )}

                        <div className={styles.infoBox}>
                          <button type="button">{getPlanName(plan?.display_name)}</button>

                          <h3>
                            {formatPrice(plan?.price, plan?.currency_type)} <sub>/{String(plan?.plan_interval || "one_time").replace("_", "-")}</sub>
                          </h3>

                          <p>{`+18% GST applies. Includes ${safeCredits} credits.`}</p>

                          <div className={styles.image}>
                            <img src={FlowerImage} alt="FlowerImage" />
                          </div>
                        </div>

                        <div className={styles.allDetails}>
                          {features.map((feature, featureIndex) => (
                            <span key={`${plan?.id || index}-feature-${featureIndex}`}>{feature}</span>
                          ))}
                        </div>

                        <div className={styles.buttonAlignment}>
                          <motion.button
                            type="button"
                            whileHover={{
                              scale: isCurrentPlanProcessing ? 1 : 1.05,
                            }}
                            whileTap={{
                              scale: isCurrentPlanProcessing ? 1 : 0.95,
                            }}
                            onClick={() => handlePlanSelect(plan)}
                            disabled={isCurrentPlanProcessing}
                          >
                            {isCurrentPlanProcessing ? "Processing..." : "Get Started Now"}
                            <RightWhiteIcon />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  );
                })
              )}
            </motion.div>

            {allDisplayedPlans.length > 3 && (
              <div className={styles.navArrows}>
                <button
                  type="button"
                  onClick={() => scrollByAmount("left")}
                  disabled={!canScrollLeft}
                  className={`${styles.navButton} ${styles.leftButton}`}
                  aria-label="Scroll plans left"
                >
                  <svg className={styles.navIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M8.77344 5.43555L3.20927 10.9997L8.77344 16.5639"
                      stroke="currentColor"
                      strokeWidth="1.375"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.7891 11H3.36156"
                      stroke="currentColor"
                      strokeWidth="1.375"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => scrollByAmount("right")}
                  disabled={!canScrollRight}
                  className={`${styles.navButton} ${styles.rightButton}`}
                  aria-label="Scroll plans right"
                >
                  <svg className={styles.navIcon} xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M13.2266 5.43555L18.7907 10.9997L13.2266 16.5639"
                      stroke="currentColor"
                      strokeWidth="1.375"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.21094 11H18.6384"
                      stroke="currentColor"
                      strokeWidth="1.375"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
