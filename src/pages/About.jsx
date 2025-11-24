// src/pages/About.jsx  (หรือจะใส่ไว้โฟลเดอร์ components ก็ได้)
import React from "react";
import styles from "./css/About.module.css";

const About = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>About QuickHelp</h1>

        <p className={styles.lead}>
          <strong>QuickHelp</strong> เป็นโปรเจคจบเทอมแรกของสาขา
          <span className={styles.highlight}>
            {" "}
            Computer Science and Innovation (CSI) ปี 2
          </span>{" "}
          ที่เน้นการพัฒนาเว็บฝั่ง <strong>Frontend</strong> เป็นหลัก
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Objective</h2>
          <p className={styles.text}>
            โปรเจคนี้ออกแบบให้เป็นแพลตฟอร์มสำหรับช่วยผู้ใช้ค้นหา
            คำตอบ/คำอธิบายแบบสั้น ๆ และอ่านคู่มือการใช้งานเบื้องต้น
            โดยโฟกัสที่โครงสร้างหน้าเว็บและประสบการณ์ใช้งานของผู้ใช้ (UI/UX)
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What we focus on</h2>
          <ul className={styles.list}>
            <li>การออกแบบ Layout ของหน้าเว็บ</li>
            <li>การจัดการ Component บน React</li>
            <li>การใช้ CSS Module แยกสไตล์ตามหน้า/คอมโพเนนต์</li>
            <li>การทำให้หน้าเว็บใช้งานง่ายและอ่านสบายตา</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Scope</h2>
          <p className={styles.text}>
            เนื่องจากเป็นโปรเจคช่วงเทอมแรก
            ที่ยังไม่ได้ลงลึกเรื่องการทำงานฝั่ง <strong>Backend</strong>{" "}
            หรือการจัดการ <strong>Database</strong>{" "}
            ระบบจึงยังไม่ได้เชื่อมต่อฐานข้อมูลจริง
          </p>
          <p className={styles.text}>
            ข้อมูลต่าง ๆ ที่แสดงในเว็บไซต์ตอนนี้เป็นเพียง{" "}
            <strong>mock data</strong> สำหรับใช้ทดสอบและสาธิตการทำงานของหน้าเว็บ
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Goal</h2>
          <p className={styles.text}>
            เป้าหมายหลักของโปรเจคนี้คือการฝึกออกแบบและสร้างเว็บไซต์
            ให้มีโครงสร้างชัดเจน ดูเป็นมืออาชีพ
            และเข้าใจโฟลว์การใช้งานในมุมมองของผู้ใช้
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
