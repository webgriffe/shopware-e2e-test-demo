/// <reference types="cypress" />

import elements from '../../../support/pages/sw-general.page-object';
import Fixture from "@shopware-ag/e2e-testsuite-platform/cypress/support/service/administration/fixture.service";

describe('Filter on startpage', () => {
    beforeEach(() => {
        Cypress.Commands.add('createManufacturerProduct', (userData = {}, manufacturerName) => {

        });
        cy.createProductFixture({
            name: 'First product',
            productNumber: 'RS-123',
        });
        // Creates a product without manufacturer
        cy.createProductFixture({
            name: 'Second product',
            manufacturerId: null,
            productNumber: 'RS-345',
        });
        // Creates a product without manufacturer
        cy.createProductFixture({
            name: 'Third product',
            manufacturerId: null,
            productNumber: 'RS-234',
        });

        const manufacturerName = 'Webgriffe';

        cy.createDefaultFixture('product-manufacturer', {name: manufacturerName});
        cy.getBearerAuth().then((authInformation) => {
            const fixture = new Fixture(authInformation);
            return fixture.search(
                'product-manufacturer',
                {
                    field: 'name',
                    type: 'equals',
                    value: manufacturerName
                }).then((manufacturer) => {
                    cy.createProductFixture({
                        name: 'Fourth product',
                        productNumber: 'RS-111',
                        manufacturerId: manufacturer.id,
                    });
                    cy.createProductFixture({
                        name: 'Fifth product',
                        productNumber: 'RS-222',
                        manufacturerId: manufacturer.id,
                });
            });
        });

        cy.visit('/');
    });

    it('Filter for manufacturer shopwareAG', { tags: ['pa-inventory'] }, () => {
        const actualItems = 5;
        const filteredItems = 1;
        const manufacturer = 'shopware AG';

        cy.get(elements.productCard).as('productCard');

        cy.get('@productCard').should('have.length', actualItems);

        cy.get(elements.manufacturerFilter).click();

        cy.contains(elements.filterLabel, manufacturer).click({
            force: true,
        });
        cy.url().should('contain', '?manufacturer=');
        cy.get('.has-element-loader').should('not.exist');

        cy.get('@productCard').should('have.length', filteredItems);

        cy.get('@productCard').first().get('.product-name').click();

        cy.get(elements.productDetailManufacturerLink).should(
            'contain',
            manufacturer,
        );
    });

    it('Filter for manufacturer Webgriffe', { tags: ['pa-inventory'] }, () => {
        const actualItems = 5;
        const filteredItems = 2;
        const manufacturer = 'Webgriffe';

        cy.get(elements.productCard).as('productCard');

        cy.get('@productCard').should('have.length', actualItems);

        cy.get(elements.manufacturerFilter).click();

        cy.contains(elements.filterLabel, manufacturer).click({
            force: true,
        });
        cy.url().should('contain', '?manufacturer=');
        cy.get('.has-element-loader').should('not.exist');

        cy.get('@productCard').should('have.length', filteredItems);

        cy.get('@productCard').first().find('.product-name').click({multiple: true});

        cy.get(elements.productDetailManufacturerLink).should(
            'contain',
            manufacturer,
        );
    });
});
