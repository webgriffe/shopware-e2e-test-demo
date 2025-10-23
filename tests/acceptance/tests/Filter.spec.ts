import { test, expect } from './../BaseTestFile';
import {Manufacturer} from "@shopware-ag/acceptance-test-suite";

test.describe('Filter on startpage', () => {
    let shopwareManufacturer: Manufacturer;
    let webgriffeManufacturer: Manufacturer;

    test.beforeEach(async ({TestDataService}) => {
        shopwareManufacturer = await TestDataService.createBasicManufacturer({name: 'shopwareAG'});
        webgriffeManufacturer = await TestDataService.createBasicManufacturer({name: 'Webgriffe'});

        await TestDataService.createBasicProduct({
            name: 'First product',
            manufacturerId: shopwareManufacturer.id,
        });
        await TestDataService.createBasicProduct({
            name: 'Second product',
        });
        await TestDataService.createBasicProduct({
            name: 'Third product',
        });
        await TestDataService.createBasicProduct({
            name: 'Fourth product',
            manufacturerId: webgriffeManufacturer.id,
        });
        await TestDataService.createBasicProduct({
            name: 'Fifth product',
            manufacturerId: webgriffeManufacturer.id,
        });
    });

    test('Filter for manufacturer shopwareAG', async ({ StorefrontHome, ShopCustomer, SelectProductFilterOption }) => {
        await ShopCustomer.goesTo(StorefrontHome.url());
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(5);

        await ShopCustomer.attemptsTo(SelectProductFilterOption(StorefrontHome.manufacturerFilter, shopwareManufacturer.name));
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(1);
    });

    test('Filter for manufacturer Webgriffe', async ({ StorefrontHome, ShopCustomer, SelectProductFilterOption }) => {
        await ShopCustomer.goesTo(StorefrontHome.url());
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(5);

        await ShopCustomer.attemptsTo(SelectProductFilterOption(StorefrontHome.manufacturerFilter, webgriffeManufacturer.name));
        await ShopCustomer.expects(StorefrontHome.productItemNames).toHaveCount(2);
    });
});
