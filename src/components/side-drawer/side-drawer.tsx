import { Component, Prop, State, Method } from "@stencil/core";

@Component({
  tag: 'ue-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})

export class SideDrawer {
  @State() showContactInfo = false;
  @Prop({reflectToAttr: true, mutable: true }) title: string;
  @Prop({reflectToAttr: true, mutable: true }) opened: boolean;

  onCloseDrawer() {
    this.opened = false;
  }

  onContentChange(content: string) {
    this.showContactInfo = content === 'contact';
  }

  @Method()
  open() {
    this.opened = true;
  }

  @Method()
  changeTitle(title: string) {
    this.title = title;
  }

  render() {
    let mainContent = <slot />;
    if (this.showContactInfo) {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us with a phone or email.</p>
          <ul>
            <li>Phone: 3141646189</li>
            <li>
              Email:
              <a href="mailto:example@example.com">example@example.com</a>
            </li>
          </ul>
        </div>
      );
    }
    return [
      <div class="backdrop" onClick={this.onCloseDrawer.bind(this)} />,
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.onCloseDrawer.bind(this)}>X</button>
        </header>
        <section id="tabs">
          <button 
            class={!this.showContactInfo ? 'active' : ''}
            onClick={this.onContentChange.bind(this, 'nav')}
          >
            Navigation
          </button>
          <button
            onClick={this.onContentChange.bind(this, 'contact')}
            class={this.showContactInfo ? 'active' : ''}
          >
            Contact
          </button>
        </section>
        <main>
          {mainContent}
          <button onClick={this.changeTitle.bind(this, 'Hello moto.')}>Change!</button>
        </main>
      </aside>
    ];
  }
}
