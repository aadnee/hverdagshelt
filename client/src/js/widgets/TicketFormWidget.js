import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';

import { ticketService } from '../services/TicketServices';
import { categoryService } from '../services/CategoryServices';
import { MessageWidget } from './MessageWidget';
import Cookies from 'js-cookie';

export class TicketFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headline: '',
      details: '',
      category: '',
      categoryOptions: [],
      subcategory: '',
      subCategoryOptions: [],
      position: [null, null],
      subscription: 'false',
      selectedCategory: false,
      modalMessage: '',
      modalOpen: false,
      image: null
    };
  }
  close = () => this.setState({ modalOpen: false });

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  submit = () => {
    console.log(this.state);
    //lat, lon and municipalId is fetched from the map
    ticketService
      .addTicket(
        this.state.headline,
        this.state.details,
        1,
        1,
        this.state.subcategory ? this.state.subcategory : this.state.category,
        Cookies.get('municipalId'),
        this.state.subscription === 'true',
        this.state.image
      )
      .then(res => {
        this.setState({ modalMessage: res.message.no, modalOpen: true });
      });
  };

  getSubCategories(category) {
    //Get subcategories based on the chosen category
    categoryService.getSubCategories(category).then(res => {
      let subcats = [];
      res.data.map(subCat => {
        subcats.push({ key: subCat.id, value: subCat.id, text: subCat.name });
      });
      this.setState({ subCategoryOptions: subcats });
    });
  }

  componentWillMount() {
    categoryService.getCategories().then(res => {
      let cats = [];
      res.data.map(cat => {
        cats.push({ key: cat.id, value: cat.id, text: cat.name });
      });
      this.setState({ categoryOptions: cats });
    });
  }

  render() {
    return (
      <Container>
        <MessageWidget
          callback={this.close}
          modalOpen={this.state.modalOpen}
          modalMessage={this.state.modalMessage}
          size={'tiny'}
        />
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked>
                <Form.Field>
                  <label>Hva vil du melde inn?</label>
                  <Input
                    fluid
                    icon="warning"
                    iconPosition="left"
                    placeholder={'Hva er problemet?'}
                    value={this.state.headline}
                    onChange={(event, data) => {
                      this.handleInput('headline', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Utdyp problemet</label>
                  <TextArea
                    autoHeight
                    placeholder={'Beskrivelse'}
                    value={this.state.details}
                    onChange={(event, data) => {
                      this.handleInput('details', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid columns={'equal'}>
                    <Grid.Column>
                      <label>Kategori</label>
                      <Dropdown
                        fluid
                        search
                        selection
                        options={this.state.categoryOptions}
                        placeholder="Kategori"
                        onChange={(event, data) => {
                          this.handleInput('category', data.value);
                          this.setState({ selectedCategory: true });
                          this.getSubCategories(data.value);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Underkategori</label>
                      <Dropdown
                        disabled={!this.state.selectedCategory}
                        fluid
                        search
                        selection
                        options={this.state.subCategoryOptions}
                        placeholder={'Underkategori'}
                        value={this.state.subcategory}
                        onChange={(event, data) => {
                          this.handleInput('subcategory', data.value);
                        }}
                      />
                    </Grid.Column>
                  </Grid>
                </Form.Field>
                <Segment placeholder>
                  <Header icon>
                    <Icon name="image file outline" />
                    Bildemodul her.
                    <input
                      type="file"
                      onChange={(event, data) => {
                        this.handleInput('image', event.target.files);
                      }}
                      className="inputfile"
                    />
                  </Header>
                  <Button primary>Legg til bilde</Button>
                </Segment>
                <Form.Field>
                  <Checkbox
                    label={<label>Jeg ønsker å abonnere på saken</label>}
                    value={this.state.subscription}
                    onChange={(event, data) => {
                      if (data.checked) {
                        this.handleInput('subscription', 'true');
                      } else {
                        this.handleInput('subscription', 'false');
                      }
                    }}
                  />
                </Form.Field>

                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={() => {
                    this.submit();
                  }}
                >
                  Send inn
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
