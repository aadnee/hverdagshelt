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
  Label,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';

import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

import Cookies from 'js-cookie';

export class TicketFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address ? this.props.address : '',
      latlng: this.props.latlng ? this.props.latlng : [null, null],
      title: this.props.ticket ? this.props.ticket.title : '',
      description: this.props.ticket ? this.props.ticket.description : '',
      category: '',
      allCats: [],
      categoryOptions: [],
      receivedCategory: this.props.ticket ? this.props.ticket.categoryId : '',
      subCategory: '',
      subCategoryOptions: [],
      position: [null, null],
      subscribed: this.props.ticket ? this.props.ticket.subscribed : false,
      selectedCategory: false,
      modalMessage: '',
      modalOpen: false,
      image: this.props.ticket ? this.props.ticket.uploads : [],
      imageUploaded: false
    };
  }
  close = () => this.setState({ modalOpen: false });

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      //console.log(this.props);
      this.setState({ address: this.props.address, latlng: this.props.latlng });
    }
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  getSubCategories(category) {
    let subCats = [];
    let subCatsOpt = [];

    this.state.allCats.map(cat => {
      if (cat.id === category) {
        subCats = cat.subs;
        console.log(subCats);
      }
    });
    subCats.map(subCat => {
      subCatsOpt.push({ key: subCat.id, value: subCat.id, text: subCat.name });
    });
    this.setState({ subCategoryOptions: subCatsOpt });
    this.state.receivedCategory === -1 ? this.setState({ subCategory: subCats[0].id }) : null;
  }

  componentWillMount() {
    let parentId = -1;
    let cats = [];
    categoryService
      .getCategories()
      .then(res => {
        this.setState({ allCats: res.data });

        res.data.map(cat => {
          cats.push({ key: cat.id, value: cat.id, text: cat.name });
          if (this.props.ticket) {
            cat.subs.map(subCat => {
              if (subCat.id === this.state.receivedCategory) {
                console.log(subCat.id);
                parentId = subCat.parentId;
                this.getSubCategories(parentId);
              }
            });
          }
        });
      })
      .then(() => {
        console.log(cats);
        !this.props.ticket ? this.setState({ categoryOptions: cats, receivedCategory: -1 }) : null;

        this.props.ticket
          ? this.setState(
              {
                address: this.props.ticket.address,
                subCategory: this.state.receivedCategory,
                category: parentId
              },
              () => {
                this.setState({ categoryOptions: cats, receivedCategory: -1 });
                console.log(this.state);
              }
            )
          : null;
      });
  }

  render() {
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked={!this.props.borderless} basic={this.props.borderless}>
                <Form.Field>
                  <label>Addresse:</label>
                  <Input
                    fluid
                    icon="map"
                    iconPosition="left"
                    placeholder="Velg posisjon på kartet"
                    defaultValue={this.state.address}
                    readOnly
                    onClick={this.props.setupClick ? (()=>this.props.setupClick(this.state.address)) : null}
                  />
                  <label>Hva vil du melde inn?</label>
                </Form.Field>
                <Form.Field>
                  <Input
                    fluid
                    icon="warning"
                    iconPosition="left"
                    placeholder={'Hva er problemet?'}
                    value={this.state.title}
                    onChange={(event, data) => {
                      this.handleInput('title', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Utdyp problemet</label>
                  <TextArea
                    autoHeight
                    placeholder={'Beskrivelse'}
                    value={this.state.description}
                    onChange={(event, data) => {
                      this.handleInput('description', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid columns={'equal'}>
                    <Grid.Column>
                      <Form.Field>
                        <label>Kategori</label>
                        <Dropdown
                          fluid
                          search
                          selection
                          value={this.state.category}
                          options={this.state.categoryOptions}
                          placeholder="Kategori"
                          onChange={(event, data) => {
                            this.handleInput('category', data.value);
                            this.setState({ selectedCategory: true }, () => {
                              this.getSubCategories(data.value);
                            });
                          }}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <label>Underkategori</label>
                        <Dropdown
                          disabled={!this.state.category}
                          fluid
                          search
                          selection
                          options={this.state.subCategoryOptions}
                          placeholder={'Underkategori'}
                          value={this.state.subCategory}
                          onChange={(event, data) => {
                            this.handleInput('subCategory', data.value);
                          }}
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Grid>
                </Form.Field>

                <Form.Field>
                  {!this.props.ticket ? (
                    <Label as={'label'} basic htmlFor={'upload'}>
                      <Button
                        icon={'upload'}
                        label={{
                          basic: true,
                          content: 'Last opp bilde'
                        }}
                        labelPosition={'right'}
                      />

                      <input
                        hidden
                        id={'upload'}
                        type="file"
                        multiple
                        className={'ui button'}
                        onChange={(event, data) => {
                          let images = this.state.image;

                          for (let i = 0; i < event.target.files.length; i++) {
                            event.target.files.name = event.target.files.filename;
                            images.push(event.target.files[i]);
                          }

                          this.setState({ image: images }, () => {
                            this.setState({ imageUploaded: true });
                          });
                        }}
                      />
                    </Label>
                  ) : null}
                  {this.state.image.length > 0
                    ? this.state.image.map((image, i) => {
                        return (
                          <Label
                            key={i}
                            id={i}
                            removeIcon={<Icon name={'delete'} />}
                            size={'large'}
                            onRemove={(event, data) => {
                              let imgs = this.state.image;
                              imgs.splice(data.id, 1);
                              this.setState({ image: imgs });
                              console.log(imgs);
                            }}
                            content={image.name || image.filename}
                          />
                        );
                      })
                    : null}
                </Form.Field>

                <Form.Field>
                  <Checkbox
                    label={<label>Jeg ønsker å abonnere på saken</label>}
                    checked={this.state.subscribed}
                    onChange={(event, data) => {
                      this.handleInput('subscribed', data.checked);
                    }}
                  />
                </Form.Field>
                {this.props.ticket ? (
                  <div>
                    <Button
                      color="blue"
                      fluid
                      size="large"
                      onClick={() => {
                        console.log(this.state);
                        this.props.editTicket(
                          this.props.ticket.id,
                          this.state.title,
                          this.state.description,
                          this.props.ticket.lat,
                          this.props.ticket.lon,
                          this.state.address,

                          this.state.subCategory,
                          this.props.ticket.municipalId,
                          this.state.subscribed,
                          this.state.image,
                          this.props.ticket.status
                        );
                      }}
                    >
                      Lagre endringer
                    </Button>
                    <Button color="grey" fluid size="large" onClick={this.props.close}>
                      Avbryt
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() => {
                      this.props.submit(
                        this.state.title,
                        this.state.description,
                        this.state.latlng.lat,
                        this.state.latlng.lng,
                        this.state.address,

                        this.state.subCategory ? this.state.subCategory : this.state.category,
                        Cookies.get('municipalId'),
                        this.state.subscribed,
                        this.state.image
                      );
                    }}
                  >
                    Send inn
                  </Button>
                )}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export class ModalTicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal open={this.props.open}>
        <TicketFormWidget
          editTicket={this.props.editTicket}
          close={this.props.close}
          ticket={this.props.ticket}
          submitButton={'Lagre endringer'}
        />
      </Modal>
    );
  }
}
