import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Announcement Banner App</h1>
        <p className={styles.text}>
          Engage your storefront visitors instantly. Configure floating banners from the Shopify Admin, stored securely in MongoDB and synchronized in real-time with Shopify Shop Metafields.
        </p>
        
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <div className={styles.label}>
              <label htmlFor="shop-domain">Shop domain</label>
              <input 
                id="shop-domain"
                className={styles.input} 
                type="text" 
                name="shop" 
                placeholder="my-shop-domain.myshopify.com"
                required
              />
              <span className={styles.labelSpan}>e.g: my-shop-domain.myshopify.com</span>
            </div>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        
        <ul className={styles.list}>
          <li>
            <strong>Admin Dashboard</strong>
            A beautiful Polaris-themed control interface to customize, preview, and update announcement content directly in Shopify.
          </li>
          <li>
            <strong>MERN Stack Log</strong>
            Uses a MongoDB database to securely store every announcement update with audit trails and timestamps.
          </li>
          <li>
            <strong>App Embed Extension</strong>
            A modern, performant Shopify Theme App Extension that displays the banner globally with zero code footprint on your theme files.
          </li>
        </ul>
      </div>
    </div>
  );
}
