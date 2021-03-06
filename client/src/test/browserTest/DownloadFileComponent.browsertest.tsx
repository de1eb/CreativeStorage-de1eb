import { describe, test } from "src/test/browserTest/settings/it";
import expect from "expect";
import MockFileManager from "src/FileManager/MockFileManager";
import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import DownloadFileComponent from "src/components/DownloadFileComponent";
import { generateTestBlob } from "src/test/browserTest/FileManager.browsertest";

describe(`<DownloadFileComponent />`, () => {
  test(`check li tags were made perfectly`, async () => {
    const fileManager = new MockFileManager();
    const numberOfProperty: number = Math.floor(Math.random() * 10 + 4);
    const filenames: string[] = [];
    for (let i = 0; i < numberOfProperty; i++) {
      const testBlob = await generateTestBlob(`${i}`);
      const filename = `${i}.txt`;
      const file = new File([testBlob], filename);
      await fileManager.uploadFile(file);
      filenames[i] = filename;
    }

    const component = render(
      <DownloadFileComponent fileManager={fileManager} />,
    );

    // in order to wait render component and set state
    const timer = await new Promise((resolve, reject) => {
      setTimeout(() => resolve("done"), 2000);
    });

    // test 1. number of li should be same the number I uploaded
    expect(
      component.getAllByRole(DownloadFileComponent.listItemRole).length,
    ).toBe(numberOfProperty);

    // test 2. test li show right filename comparing what I upload
    const isAllFileNameInComponent = filenames.every((filename) => {
      if (component.getAllByText(filename).length === 1) {
        return true;
      } else {
        return false;
      }
    });
    expect(isAllFileNameInComponent).toEqual(true);

    // test 3. test when delete file, whether file is deleted or not
    const deleteButton = component.getAllByRole("delete-button")[0];
    fireEvent.click(deleteButton);

    const fileMetadataList = await fileManager.getFileMetadataList();
    expect(fileMetadataList.length).toBe(numberOfProperty - 1);
  });
});
