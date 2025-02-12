import { expect, test } from "@playwright/test";

test("should navigate to the landing page and render Hero component correctly", async ({
  page,
}) => {
  await page.goto("/");

  // Verifica o título da página
  await expect(page).toHaveTitle(/Nebulaform/);

  // Verifica se o título principal do Hero está correto
  await expect(page.locator("h1")).toHaveText(
    /Elevate Feedback Collection with Powerful Forms./
  );

  // Verifica se o parágrafo de descrição do Hero está correto
  await expect(page.locator("p")).toHaveText(
    /Gain actionable insights and transform feedback into meaningful data/
  );

  // Verifica se o botão "Get Started for Free" está visível e aponta para "/signup"
  const signUpButton = page.locator("text=Get Started for Free");
  await expect(signUpButton).toBeVisible();
  await expect(signUpButton).toHaveAttribute("href", "/signup");

  // Verifica se a imagem do Hero está presente e carregando corretamente
  const heroImage = page.locator("img[alt='hero preview feature']");
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute("src", "/hero.png");
});
test("should render the Features section correctly", async ({ page }) => {
  await page.goto("/");

  // Verifica se a seção "Features" está visível
  const featuresSection = page.locator("section#features");
  await expect(featuresSection).toBeVisible();

  // Verifica se o título principal da seção está correto
  await expect(featuresSection.locator("h2")).toHaveText(
    /Powerful Tools for Form Building/
  );

  // Verifica se a descrição da seção está correta
  await expect(featuresSection.locator("p")).toContainText(
    "Enhance your form-building experience"
  );

  // Verifica se existem exatamente 3 features sendo renderizadas
  const featureItems = featuresSection.locator("div[role='article']");
  await expect(featureItems).toHaveCount(3);

  // Verifica cada feature individualmente
  const features = [
    {
      title: "Effortless Form Creation",
      description: "Create custom forms quickly with our intuitive editor.",
    },
    {
      title: "Actionable Analytics",
      description: "Get insights to optimize your forms for better results.",
    },
    {
      title: "Seamless Data Management",
      description: "Easily export submissions and data for offline analysis.",
    },
  ];

  for (const feature of features) {
    const featureElement = featuresSection.locator(`text=${feature.title}`);
    await expect(featureElement).toBeVisible();
    await expect(
      featuresSection.locator(`text=${feature.description}`)
    ).toBeVisible();
  }
});
test("should render the How It Works section correctly", async ({ page }) => {
  await page.goto("/");

  // Seleciona a seção pelo ID
  const section = page.locator("section#how-it-works");
  await expect(section).toBeVisible();

  // Verifica o título principal
  await expect(section.locator("h2")).toHaveText(/How It Works/);

  // Verifica a descrição da seção
  await expect(section.locator("p")).toContainText(
    "Easily create, customize, and manage forms"
  );

  // Verifica se existem exatamente 6 passos sendo exibidos
  const stepItems = section.locator("div[role='article']");
  await expect(stepItems).toHaveCount(6);

  // Lista dos passos esperados
  const steps = [
    {
      title: "Design Your Form",
      description:
        "Effortlessly create a form tailored to your specific needs.",
    },
    {
      title: "Customize and Publish",
      description:
        "Personalize your form and publish it with just a few clicks.",
    },
    {
      title: "Share Instantly",
      description: "Distribute your form easily via link or QR code.",
    },
    {
      title: "Manage Submissions",
      description: "Track and organize submissions from a central dashboard.",
    },
    {
      title: "Unlock Insights",
      description:
        "Analyze form performance using our powerful analytics tools.",
    },
    {
      title: "Export with Ease",
      description: "Download submissions and analytics for offline review.",
    },
  ];

  // Verifica cada passo individualmente
  for (const step of steps) {
    const stepElement = section.locator(`text=${step.title}`);
    await expect(stepElement).toBeVisible();
    await expect(section.locator(`text=${step.description}`)).toBeVisible();
  }
});
test("should render the Pricing section correctly", async ({ page }) => {
  await page.goto("/");

  // Seleciona a seção pelo ID
  const section = page.locator("section#pricing");
  await expect(section).toBeVisible();

  // Verifica o título principal
  await expect(section.locator("h2")).toHaveText(/Simple & Flexible Pricing/);

  // Verifica a descrição da seção
  await expect(section.locator("p")).toContainText("Pick the perfect plan");

  // Verifica se os planos foram carregados
  const plans = section.locator("div[role='article']");
  await expect(plans).toHaveCount(3); // Ajuste o número conforme a quantidade real de planos

  // Verifica os elementos essenciais em cada plano
  for (const plan of await plans.all()) {
    await expect(plan.locator("h3")).toBeVisible(); // Nome do plano
    await expect(plan.locator("p.text-4xl")).toBeVisible(); // Preço
    await expect(plan.locator("button")).toBeVisible(); // Botão de ação
    await expect(plan.locator("ul")).toBeVisible(); // Lista de features
  }

  // Verifica se o plano destacado contém o badge "Most Popular"
  const highlightedPlan = section.locator(".border-primary.border-2");
  if (await highlightedPlan.count()) {
    await expect(highlightedPlan.locator("span")).toHaveText(/Most Popular/);
  }
});
test("should render the FAQ section and toggle answers", async ({ page }) => {
  await page.goto("/");

  // Seleciona a seção pelo ID
  const section = page.locator("#faq");
  await expect(section).toBeVisible();

  // Verifica o título principal
  await expect(section.locator("h2")).toHaveText(/Frequently Asked Questions/);

  // Verifica se todas as perguntas estão presentes
  const questions = section.locator("button");
  await expect(questions).toHaveCount(4); // Ajuste se houver mais perguntas

  // Testa a funcionalidade de expandir/recolher
  for (let i = 0; i < 4; i++) {
    const question = questions.nth(i);
    const answer = section.locator("p").nth(i);

    await question.click(); // Expande
    await expect(answer).toBeVisible();

    await question.click(); // Recolhe
    await expect(answer).not.toBeVisible();
  }
});
test("should render CTA section and verify button action", async ({ page }) => {
  await page.goto("/");

  // Seleciona a seção CTA pelo texto
  const ctaSection = page.locator(
    "section:has-text('Ready to improve your business?')"
  );
  await expect(ctaSection).toBeVisible();

  // Verifica se o logo está renderizado
  const logo = ctaSection.locator("svg");
  await expect(logo).toBeVisible();

  // Verifica o título e subtítulo
  await expect(ctaSection.locator("h2")).toHaveText(
    "Ready to improve your business?"
  );
  await expect(ctaSection.locator("p")).toHaveText(
    /Start your free trial today/
  );

  // Verifica se o botão existe e tem o texto correto
  const button = ctaSection.locator("button:has-text('Get Started for Free')");
  await expect(button).toBeVisible();

  // Testa se o botão redireciona corretamente
  await button.click();
  await expect(page).toHaveURL(/\/signup/);
});
