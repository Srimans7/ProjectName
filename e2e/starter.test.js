describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show TaskToday', async () => {
   
    await expect(element(by.text('Task Today'))).toBeVisible();
  });


});
