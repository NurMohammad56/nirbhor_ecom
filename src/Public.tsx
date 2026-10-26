import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Check,
  ShieldCheck,
  Truck,
  Package,
  Heart,
} from "lucide-react";
import { useStore } from "./store";
import { Breadcrumb, Button, SectionTitle, Empty } from "./ui";
import { Faq } from "./Product";
import { money } from "./data";
export function About() {
  const { content } = useStore();
  return (
    <>
      <section className="about-hero container">
        <Breadcrumb items={[{ label: "Our story" }]} />
        <div>
          <span className="eyebrow">GOODNESS IS IN THE LITTLE THINGS</span>
          <h1>
            {content["page-title-about"] ||
              "Thoughtful by choice.\nNatural at heart."}
          </h1>
          <p>For your pantry, your home, and the life in between.</p>
        </div>
        <img
          src="/assets/hero.webp"
          alt="A thoughtful selection of honey, nuts and dates"
        />
      </section>
      <section className="container about-story section">
        <span className="eyebrow">A LITTLE ABOUT NIRBHOR</span>
        <h2>
          Good choices should
          <br />
          feel a little simpler.
        </h2>
        <div>
          {content["page-body-about"] ? (
            content["page-body-about"]
              .split("\n\n")
              .map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <>
              <p>
                Some of the best things in life are wonderfully uncomplicated. A
                spoonful of raw honey. A handful of fresh nuts. A home filled
                with things you love using.
              </p>
              <p>
                NIRBHOR brings these little moments together. We choose honest
                products, look closely at where they come from, and put a little
                more care into how they reach you.
              </p>
              <p>
                Our name means something to lean on. And that’s what we hope to
                be: a thoughtful place to find the everyday good.
              </p>
            </>
          )}
        </div>
      </section>
      <section className="about-values">
        <div className="container section">
          <SectionTitle
            eyebrow="WHAT WE COME BACK TO"
            title="A few good things we believe in."
          />
          <div className="benefit-grid">
            {[
              [
                Leaf,
                "Honest, always.",
                "Clear ingredients. Transparent sources. No unnecessary promises.",
              ],
              [
                Heart,
                "Care in the details.",
                "From choosing a product to packing your order, the little things matter.",
              ],
              [
                Package,
                "Less, but better.",
                "Thoughtfully selected essentials that deserve a place in your everyday.",
              ],
              [
                Truck,
                "Goodness for everyone.",
                "A simple, welcoming shopping experience, wherever you call home.",
              ],
            ].map(([I, t, d]) => {
              const Icon = I as typeof Leaf;
              return (
                <div key={String(t)}>
                  <Icon size={27} strokeWidth={1.3} />
                  <h3>{String(t)}</h3>
                  <p>{String(d)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="brand-promise container">
        <Leaf size={32} />
        <h2>
          A little closer to nature.
          <br />
          <em>A little more you.</em>
        </h2>
        <Button to="/shop">
          Find your everyday good <ArrowRight size={16} />
        </Button>
      </section>
    </>
  );
}
export function Contact() {
  const { settings, content, toast, setContent } = useStore(),
    [sent, setSent] = useState(false);
  return (
    <main className="container page-space contact-page">
      <Breadcrumb items={[{ label: "Say hello" }]} />
      <div className="contact-grid">
        <div>
          <span className="eyebrow">REAL PEOPLE. A LITTLE HELP.</span>
          <h1>
            {content["page-title-contact"] || "Let’s talk\na little goodness."}
          </h1>
          <p>
            {content["page-body-contact"] ||
              "An order question, a product thought, or just a hello. We’re happy to hear from you."}
          </p>
          <div className="contact-info">
            <a href={`mailto:${settings.email}`}>
              <Mail size={22} />
              <span>
                <small>DROP US A LITTLE NOTE</small>
                <b>{settings.email}</b>
              </span>
              <ArrowUpRight size={16} />
            </a>
            <a href={`tel:${settings.phone}`}>
              <Phone size={22} />
              <span>
                <small>LET’S HAVE A LITTLE CHAT</small>
                <b>{settings.phone}</b>
              </span>
              <ArrowUpRight size={16} />
            </a>
            <div>
              <MapPin size={22} />
              <span>
                <small>WHERE WE CALL HOME</small>
                <b>{settings.address}</b>
              </span>
            </div>
          </div>
          <p className="small muted">
            Saturday–Thursday, 9am–6pm · Bangladesh time
          </p>
          <Link className="text-link" to="/help">
            A few answers you might find useful <ArrowUpRight size={15} />
          </Link>
        </div>
        {sent ? (
          <div className="contact-form">
            <Empty
              icon={Check}
              title="Your little note is saved."
              text="Thank you for reaching out. This message is stored in the frontend preview; sending to support will be connected with the backend."
              action={
                <Button onClick={() => setSent(false)}>
                  Send another little note
                </Button>
              }
            />
          </div>
        ) : (
          <form
            className="contact-form form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const message = Object.fromEntries(f.entries());
              const previous = (() => {
                try {
                  return JSON.parse(content.messages || "[]");
                } catch {
                  return [];
                }
              })();
              setContent((x) => ({
                ...x,
                messages: JSON.stringify([
                  { ...message, date: new Date().toISOString() },
                  ...previous,
                ]),
              }));
              setSent(true);
              toast("Your message is saved in this preview.");
            }}
          >
            <h2>A little message for us.</h2>
            <div className="form-grid">
              <label className="field">
                Your name
                <input
                  name="name"
                  required
                  placeholder="How should we address you?"
                />
              </label>
              <label className="field">
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="field">
              What’s on your mind?
              <select name="subject">
                <option>An order question</option>
                <option>A product question</option>
                <option>Returns & refunds</option>
                <option>A little feedback</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="field">
              Order number (optional)
              <input name="order" placeholder="NBR-…" />
            </label>
            <label className="field">
              Your message
              <textarea
                name="message"
                rows={5}
                required
                minLength={10}
                placeholder="Tell us a little more…"
              />
            </label>
            <Button type="submit">
              Send a little hello <ArrowRight size={16} />
            </Button>
            <p className="small muted">
              Preview form: messages stay in this browser.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
export function Help() {
  return (
    <main className="container page-space help-page">
      <Breadcrumb items={[{ label: "A little help" }]} />
      <div className="tracking-intro">
        <span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span>
        <h1>Good questions. Honest answers.</h1>
        <p>Everything you might want to know before your next good choice.</p>
      </div>
      <Faq />
      <div className="help-contact">
        <Leaf size={27} />
        <h2>Still a little curious?</h2>
        <p>We’re real people, and we’re happy to help.</p>
        <Button to="/contact">
          Let’s have a little chat <ArrowUpRight size={16} />
        </Button>
      </div>
    </main>
  );
}
export function StaticPage() {
  const { slug = "" } = useParams(),
    { settings, content } = useStore();
  const pages: Record<
    string,
    {
      title: string;
      eyebrow: string;
      intro: string;
      sections: [string, string][];
    }
  > = {
    shipping: {
      title: "A little care, delivered.",
      eyebrow: "OUR DELIVERY PROMISE",
      intro:
        "From our shelves to your doorstep, carefully packed and thoughtfully handled.",
      sections: [
        [
          "Where we deliver",
          "We deliver across Bangladesh, subject to courier coverage. If your address needs a little extra attention, we’ll confirm the details before dispatch.",
        ],
        [
          "A little about timing",
          `Dhaka: typically 1–2 working days. Outside Dhaka: typically 3–5 working days. Public holidays and remote areas may take a little longer.`,
        ],
        [
          "Simple delivery charges",
          `Dhaka delivery is ${money(settings.dhaka)}. Outside Dhaka is ${money(settings.outside)}. Orders of ${money(settings.freeShipping)} or more qualify for free standard delivery.`,
        ],
        [
          "When the goodness arrives",
          "Please check your parcel on delivery. Keep your order number and contact our support team if anything needs a little care.",
        ],
      ],
    },
    returns: {
      title: "A little reassurance.",
      eyebrow: "RETURNS & REFUNDS",
      intro:
        "Good choices should come with a little confidence. Here’s how we help when something isn’t right.",
      sections: [
        [
          "Damaged or incorrect items",
          "Please contact us within 48 hours of delivery with your order number and clear photos of the product and packaging. Keep all packaging until we have reviewed the issue.",
        ],
        [
          "A thoughtful review",
          "Our team will review your request and explain the available next steps. Unopened, unused items may be eligible for return, subject to product condition and category. Perishable and opened food items cannot generally be returned for a change of mind.",
        ],
        [
          "How to request help",
          "Sign in, open the delivered order, and choose “Request a return / refund”, or contact us with your order details.",
        ],
        [
          "Refunds, when approved",
          "Refund method and timing are confirmed after the return is reviewed. Online refunds depend on the payment provider. In this frontend preview, requests are stored locally.",
        ],
      ],
    },
    sourcing: {
      title: "Honest origins. Everyday good.",
      eyebrow: "OUR SOURCING PROMISE",
      intro:
        "We believe knowing a little more about your products makes choosing feel a little better.",
      sections: [
        [
          "Look closer at the source",
          "We share origin and batch details wherever possible. Organic pantry products include source information on their product pages.",
        ],
        [
          "Keep the character",
          "Seasonal food varies in colour, texture, aroma, and size. We value the natural character of each batch, with clear product information to help you choose.",
        ],
        [
          "Nothing unnecessary",
          "We focus on straightforward ingredients and thoughtful materials. Check each product’s description and label for ingredient and allergen information.",
        ],
        [
          "Care all the way through",
          "Products are chosen, checked, and carefully packed for the journey to your home. If you have a question about a source or batch, we’re happy to help.",
        ],
      ],
    },
    privacy: {
      title: "A little respect for your privacy.",
      eyebrow: "PRIVACY POLICY · PREVIEW DRAFT",
      intro:
        "Clear information about the details you share while exploring NIRBHOR.",
      sections: [
        [
          "Information in this preview",
          "This frontend stores products, bag contents, favourites, profile details and sample orders in your browser’s local storage. It does not create a server account, store passwords or collect card details.",
        ],
        [
          "Your choices",
          "You can remove saved addresses, clear your bag and sign out through your account. Clear browser site data to remove all locally saved preview information.",
        ],
        [
          "Analytics and communication",
          "Storefront events are logged locally for the admin preview. No Meta Pixel requests, emails or SMS messages are sent by this implementation.",
        ],
        [
          "Before the live store launches",
          "This policy will be finalised to reflect the backend, payment providers, analytics, retention periods, and customer rights before collecting real customer data.",
        ],
      ],
    },
    terms: {
      title: "A few thoughtful ground rules.",
      eyebrow: "TERMS & CONDITIONS · PREVIEW DRAFT",
      intro: "A clear starting point for shopping with a little confidence.",
      sections: [
        [
          "About this experience",
          "NIRBHOR is currently a frontend review experience. Product information, prices, availability and orders demonstrate the planned shopping flow. No real payment is charged and no shipment is dispatched.",
        ],
        [
          "Products and availability",
          "Product pages show size, source, stock and price details. In a live store, availability and final order details will be confirmed before fulfilment.",
        ],
        [
          "Orders and payment",
          "Checkout shows your selected items, delivery charges, discounts and total before confirmation. This preview supports locally saved orders and simulated account access.",
        ],
        [
          "Delivery and returns",
          "The delivery and returns pages describe the intended customer experience. Final operating policies will be confirmed with the live store.",
        ],
        [
          "Need a little help?",
          `Contact ${settings.email} with questions about the platform or your order preview.`,
        ],
      ],
    },
  };
  const p = pages[slug];
  if (!p)
    return (
      <main className="container page-space">
        <Empty
          title="This little page is still finding its place."
          text="Let’s bring you back to something good."
          action={
            <Button to="/">
              Back home <ArrowRight size={16} />
            </Button>
          }
        />
      </main>
    );
  return (
    <main className="container page-space policy-page">
      <Breadcrumb items={[{ label: p.title }]} />
      <span className="eyebrow">{p.eyebrow}</span>
      <h1>{content[`page-title-${slug}`] || p.title}</h1>
      <p className="policy-intro">{p.intro}</p>
      <div className="policy-body">
        {content[`page-body-${slug}`]
          ? content[`page-body-${slug}`]
              .split("\n\n")
              .map((t, i) => <p key={i}>{t}</p>)
          : p.sections.map(([t, d]) => (
              <section key={t}>
                <h2>{t}</h2>
                <p>{d}</p>
              </section>
            ))}
      </div>
      <Link className="text-link" to="/contact">
        A little more help? <ArrowUpRight size={15} />
      </Link>
    </main>
  );
}
