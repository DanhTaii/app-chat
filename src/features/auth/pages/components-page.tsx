import Button from "../../../shared/components/button";
import Input from "../../../shared/components/Input";
import "./components-page.scss";

function ComponentsPage() {
  return (
    <section className="components">
      <h1>Button</h1>
      <Input type="text" placeholder="Enter your name" />
      <Input type="checkbox" />
      <div className="components__buttons">
        <Button type="button">B1</Button>
        <Button type="button" variant="outline">
          B2
        </Button>
      </div>
    </section>
  );
}

export default ComponentsPage;
