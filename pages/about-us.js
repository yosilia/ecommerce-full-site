import Center from "@/components/Center";
import Header from "@/components/Header";
import InputStyling from "@/components/InputStyling";
import LongButton from "@/components/LongButton";
import Title from "@/components/Title";
import styled from "styled-components";

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
          <InputStyling type="text" placeholder="Name" />
          <InputStyling type="email" placeholder="E-mail" />
          <TextArea placeholder="Message" />
          <LongButton>Send Message</LongButton>
        </FormContainer>
      </Center>
    </>
  );
}
