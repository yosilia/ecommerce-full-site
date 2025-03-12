import Center from "@/Components User/Center";
import Header from "@/Components User/Header";
import { Input } from "@/Components User/CommonStyles";
import LongButton from "@/Components User/LongButton";
import Title from "@/Components User/Title";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

const ParagFormatting = styled.div`
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const ParagWriting = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-style: italic;
  color: #333;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 40px auto 0;
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  height: auto;
  box-sizing: border-box;
  font-family: lora;
`;

export default function AboutUsPage() {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/general-queries", formData);
      setMessage("Message sent successfully!");
      setFormData({ clientName: "", clientEmail: "", message: "" });
    } catch (error) {
      setMessage("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <Center>
        <Title style={{ textAlign: "center", marginBottom: "1rem" }}>
          About Us
        </Title>
        <ParagFormatting>
          <ParagWriting>
            Welcome to DM Touch, where tradition meets modern elegance. We are
            an e-commerce brand dedicated to crafting exquisite modern African
            and bespoke English clothing. Our designs seamlessly blend cultural
            heritage with contemporary fashion, ensuring you stand out in any
            setting.
          </ParagWriting>
          <ParagWriting>
            At the heart of DM Touch is our visionary designer, Sheriff, a
            Nigerian-born creative with over 25 years of experience in the
            fashion industry. Since the early 2000s, Sheriff has been
            perfecting the art of tailoring, dressing notable figures and
            influencers with unmatched craftsmanship. Every stitch, every
            detail, and every piece is a testament to years of dedication,
            skill, and passion.
          </ParagWriting>
          <ParagWriting>
            Quality is the foundation of our brand. We believe that fashion is
            more than just clothing—it’s an expression of identity, confidence,
            and excellence. That’s why we pour sweat and hard work into creating
            garments that are not only stylish but also made to the highest
            standards. When you wear DM Touch, you’re wearing a piece of luxury,
            authenticity, and craftsmanship that simply cannot be replicated.
          </ParagWriting>
          <ParagWriting>
            Thank you for choosing us. We are honored to be part of your
            style journey and can’t wait to bring you the best clothing
            experience possible. Shop with us today and step into a world where
            fashion meets art, culture, and individuality.
          </ParagWriting>
        </ParagFormatting>

        {/* Contact Form Section */}
        <FormContainer>
          <ParagWriting>
            If you have any general queries, feel free to message us.
          </ParagWriting>
         
          <form onSubmit={handleSubmit}>
          <Input
              type="text"
              placeholder="Name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              required
            />
            <TextArea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <LongButton type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </LongButton>
          </form>
          {message && <p>{message}</p>}

        </FormContainer>
      </Center>
    </>
  );
}
