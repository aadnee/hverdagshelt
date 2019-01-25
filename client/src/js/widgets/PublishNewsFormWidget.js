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
  Image,
  Modal,
  Segment,
  TextArea,
  Label
} from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';
import { Consumer } from '../context';

import { STATUS } from '../commons';
import { companyService } from '../services/CompanyServices';
import Cookies from 'js-cookie';

export class PublishNewsFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      subscription: false,
      publish: true,
      //CategoryStates
      receivedCategory: '',
      allCats: [],
      category: '',
      categoryOptions: [],
      subCategory: '',
      subCategoryOptions: [],
      categoryChanged: false,
      //states for news administation
      status: '',
      statusOptions: [],
      company: '',
      companyOptions: [],
      //map states
      position: [1, 1],
      address: '',
      image: [],
      imgModalOpen: false
    };
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
      }
    });
    subCats.map(subCat => {
      subCatsOpt.push({ key: subCat.id, value: subCat.id, text: subCat.name });
    });
    this.setState({ subCategoryOptions: subCatsOpt });
    this.state.receivedCategory === -1 ? this.setState({ subCategory: subCats[0].id }) : null;
  }

  componentWillMount() {
    if (this.props.news) {
      let news = this.props.news;
      let statusOptions = [
        { key: 1, value: 2, text: STATUS[1].norwegian },
        { key: 2, value: 3, text: STATUS[2].norwegian }
      ];
      let companyOptions = [];
      //MunicipalId should be fetched from context
      companyService.getLocalCompanies(Cookies.get('municipalId')).then(res => {
        res.data.map(company => {
          companyOptions.push({ key: 1, value: company.id, text: company.name });
          companyOptions.push({ key: 2, value: company.id + 1, text: 'Company' });
        });
      });
      this.setState({
        title: news.title,
        description: news.description,
        receivedCategory: news.categoryId,
        category: news.categoryId,
        address: news.address,
        position: [news.lat, news.lon],
        status: news.status,
        statusOptions: statusOptions,
        company: news.companyId ? news.companyId : 4,
        companyOptions: companyOptions
      });
    }
    if (this.props.ticket) {
      let ticket = this.props.ticket;
      this.setState({
        title: ticket.title,
        description: ticket.description,
        receivedCategory: ticket.categoryId,
        category: ticket.categoryId,
        address: ticket.address,
        image: ticket.uploads,
        position: [ticket.lat, ticket.lon]
      });
    }
    let parentId = -1;
    let cats = [];
    categoryService
      .getCategories()
      .then(res => {
        this.setState({ allCats: res.data });

        res.data.map(cat => {
          cats.push({ key: cat.id, value: cat.id, text: cat.name });
          if (this.props.ticket || this.props.news) {
            cat.subs.map(subCat => {
              if (subCat.id === this.state.receivedCategory) {
                parentId = subCat.parentId;
                this.getSubCategories(parentId);
              }
            });
          }
        });
      })
      .then(() => {
        !this.props.ticket && !this.props.news ? this.setState({ categoryOptions: cats, receivedCategory: -1 }) : null;

        this.props.ticket || this.props.news
          ? this.setState(
              {
                subCategory: this.state.receivedCategory,
                category: parentId
              },
              () => {
                this.setState({ categoryOptions: cats, receivedCategory: -1 });
              }
            )
          : null;
      });
  }

  render() {
    const mun = Consumer._currentValue.user.municipalId;
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked>
                <Form.Field>
                  <label>{this.props.news ? 'Nyhetstittel' : 'Brukeren har meldt inn feil om'}:</label>
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
                  <label>{this.props.news ? 'Nyhetsbeskrivelse' : 'Utdypet'}</label>
                  <TextArea
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
                          this.setState({ categoryChanged: true }, () => {
                            this.getSubCategories(data.value);
                          });
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Underkategori</label>
                      <Dropdown
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
                    </Grid.Column>
                  </Grid>
                </Form.Field>
                {this.state.image.length > 0 ? (
                  <Form.Field>
                    <Label basic as={'label'}>
                      {this.state.image.map((image, i) => {
                        return (
                          <Modal
                            basic
                            dimmer={'blurring'}
                            size={'large'}
                            closeIcon
                            key={i}
                            trigger={
                              <Label
                                id={i}
                                removeIcon={<Icon name={'delete'} />}
                                size={'large'}
                                onRemove={(event, data) => {
                                  let newImages = [];
                                  this.state.image.map((img, i) => {
                                    if (i !== data.id) {
                                      newImages.push(img);
                                    }
                                  });

                                  this.setState({ image: newImages });
                                }}
                                as={'a'}
                                content={image.filename || image.name}
                              />
                            }
                          >
                            <Modal.Content image>
                              <Image wrapped src={'http://localhost:3000/uploads/' + image.filename} />
                            </Modal.Content>
                          </Modal>
                        );
                      })}
                    </Label>
                  </Form.Field>
                ) : null}

                {/*IF NEWS EXISTS */}
                {/*{this.props.news ? (
                  <Form.Field>
                    <Grid columns={'equal'}>
                      <Grid.Column>
                        <label>Knytt til bedrift</label>
                        <Dropdown
                          fluid
                          selection
                          options={this.state.companyOptions}
                          placeholder={'Bedrift'}
                          value={this.state.company}
                          onChange={(event, data) => {
                            this.handleInput('company', data.value);
                          }}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Status</label>
                        <Dropdown
                          fluid
                          selection
                          options={this.state.statusOptions}
                          placeholder={'Underkategori'}
                          value={this.state.status}
                          onChange={(event, data) => {
                            this.handleInput('status', data.value);
                            console.log(this.state.status);
                          }}
                        />
                      </Grid.Column>
                    </Grid>
                  </Form.Field>
                ) : null}*/}
                {/*}
                <Form.Field>
                  <Grid>
                    <Grid.Column>
                      <Checkbox
                        checked={this.state.publish}
                        label={<label>Gjør nyhet synlig</label>}
                        onChange={(event, data) => {
                          this.handleInput('publish', data.checked);
                          console.log(data.checked);
                        }}
                      />
                    </Grid.Column>
                  </Grid>
                </Form.Field>
*/}
                <Button.Group fluid>
                  <Button onClick={() => this.props.close()}>Avbryt</Button>
                  <Button
                    color="blue"
                    size="large"
                    onClick={() =>
                      this.props.ticket
                        ? this.props.accept(
                            this.state.title,
                            this.state.description,
                            this.state.position[0],
                            this.state.position[1],
                            this.state.address,
                            this.state.subCategory,
                            this.state.publish,
                            mun,
                            this.state.image
                          )
                        : this.props.news
                        ? this.props.editNews(
                            this.state.title,
                            this.state.description,
                            this.state.subCategory,
                            this.state.status,
                            this.state.publish,
                            this.state.company
                          )
                        : null
                    }
                  >
                    {this.props.submitButton}
                  </Button>
                </Button.Group>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
