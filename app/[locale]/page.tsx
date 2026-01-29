import {
  About,
  BackgroundPattern,
  Contact,
  Footer,
  Header,
  Hero,
  Projects,
  Skills,
} from "./_components";

const Home = () => {
  return (
    <BackgroundPattern>
      <div className="relative z-10">
        <Header isHome={true} />

        <main>
          <Hero />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>
    </BackgroundPattern>
  );
};

export default Home;
