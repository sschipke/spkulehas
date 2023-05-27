import moment from "moment";
import { startOf } from "react-big-calendar/lib/utils/dates";
import uuid from "react-uuid";

const reservations = [
      {
        id: uuid(),
        start: moment('2022-05-09')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-05-09')
        .endOf('isoWeek')
        .toDate(),
          allDay: true,
        title: "Tyler Parry",
        user_id: Date.now().toString()
      },
      {
        id: uuid(),
        start: moment('2022-05-23')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-05-23')
        .endOf('isoWeek')
        .toDate(),
          allDay: true,
        title: "Denise Smeenk",
        user_id: '2a778ee1-0dff-4633-a825-c58fedf30684'
      },
      {
        id: uuid(),
        start: moment('2022-05-30')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-05-30')
          .endOf('isoWeek')
          .toDate(),
        title: "Paul Schipke",
        user_id: '864ea051-2610-4f62-88b0-29f50df3f3d2'
      },
      {
        id: uuid(),
        start: moment('2022-06-06')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-06-06')
          .endOf('isoWeek')
          .toDate(),
        title: "Melanie Garstenshiager",
        user_id: 'a98e122d-ecde-445a-9a25-9aaa49d3e53a'
      },
      {
        id: uuid(),
        start: moment('2022-06-13')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-06-13')
          .endOf('isoWeek')
          .toDate(),
        title: "Stephanie Kuster",
        user_id: '23266588-7773-438d-83eb-1a84d0c72245'
      },
      {
        id: uuid(),
        start: moment('2022-06-20')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-06-20')
          .endOf('isoWeek')
          .toDate(),
        title: "Chris Schipke",
        user_id: '8b08c91b-5e37-47d1-a11b-0bef3a10fbdd'
      },
      {
        id: uuid(),
        start: moment('2022-06-27')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-06-27')
          .endOf('isoWeek')
          .toDate(),
        title: "Doug Albertson",
        user_id: '371e0b1b-1a85-4d0d-830e-499786ef7e9f'
      },
      {
        id: uuid(),
        start: moment('2022-07-04')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-07-04')
          .endOf('isoWeek')
          .toDate(),
        title: "Steven Schipke",
        user_id: 'eb3169b4-3935-4bf3-9feb-3acc19ea71dd'
      },
      {
        id: uuid(),
        start: moment('2022-07-11')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-07-11')
          .endOf('isoWeek')
          .toDate(),
        title: "Dick Kuster",
        user_id: '1f591ff2-0c55-460e-bd01-1c1b1294ad6a',
      },
      {
        id: uuid(),
        start: moment('2022-07-18')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-07-18')
          .endOf('isoWeek')
          .toDate(),
        title: "Wendy Huft",
        user_id: '37157f68-c779-4838-8793-e0c5d4a69267'
      },
      {
        id: uuid(),
        start: moment('2022-07-25')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-07-25')
          .endOf('isoWeek')
          .toDate(),
        title: "Mike Albertson",
        user_id: '7ce93aa0-1b60-4d1a-926a-2cc87c2f41fe'
      },
      {
        id: uuid(),
        start: moment('2022-08-01')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-08-01')
          .endOf('isoWeek')
          .toDate(),
        title: "Mark Snoozy",
        user_id: '6e81bb50-e350-4c87-928e-14c373a6eb3f'
      },
      {
        id: uuid(),
        start: moment('2022-08-08')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-08-08')
          .endOf('isoWeek')
          .toDate(),
        title: "Christine Orwick",
        user_id: '3b814266-9b58-4e25-aae6-cde737e526ed'
      },
      {
        id: uuid(),
        start: moment('2022-08-15')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-08-15')
          .endOf('isoWeek')
          .toDate(),
        title: "Demian Heinert",
        user_id: 'c563409e-e4d1-49c7-99e9-873d094ce9cc'
      },
      {
        id: uuid(),
        start: moment('2022-08-22')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-08-22')
          .endOf('isoWeek')
          .toDate(),
        title: "Jill Orwick",
        user_id: 'b7e8648a-3659-4faf-b361-0ac91dd9c67d'
      },
      {
        id: uuid(),
        start: moment('2022-08-29')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-08-29')
          .endOf('isoWeek')
          .toDate(),
        title: "Dwight Schipke",
        user_id: '2a28e790-46ad-49c2-b6b6-836161477a9d'
      },
      {
        id: uuid(),
        start: moment('2022-09-05')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-09-05')
          .endOf('isoWeek')
          .toDate(),
        title: "Brian Schipke",
        user_id: '2a6481a9-0bae-4caf-bbcb-65365fbda2fa'
      },
      {
        id: uuid(),
        start: moment('2022-09-12')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-09-12')
          .endOf('isoWeek')
          .toDate(),
        title: "Kelli Wieczorek",
        user_id: '8b609a69-902b-4891-8d33-4b598c1076a8'
      },
      {
        id: uuid(),
        start: moment('2022-09-19')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-09-19')
          .endOf('isoWeek')
          .toDate(),
        title: "Stephanie Schipke",
        user_id: 'b7e78347-aacd-4fbb-ae9d-23b6e1e7f993'
      },
      {
        id: uuid(),
        start: moment('2022-09-26')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-09-26')
          .endOf('isoWeek')
          .toDate(),
        title: "Dwight Schipke",
        user_id: '2a28e790-46ad-49c2-b6b6-836161477a9d'
      },
      {
        id: uuid(),
        start: moment('2022-10-03')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-10-03')
          .endOf('isoWeek')
          .toDate(),
        title: "Gale Schipke",
        user_id: '2be3704b-3ab5-4cd4-9630-a056d76a2bc0'
      },
      {
        id: uuid(),
        start: moment('2022-10-10')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-10-10')
          .endOf('isoWeek')
          .toDate(),
        title: "Chris Kuster",
        user_id: '272ee54e-5ba8-4cf8-ab6d-bdf9032b7b5a'
      },
      {
        id: uuid(),
        start: moment('2022-10-17')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2022-10-17')
          .endOf('isoWeek')
          .toDate(),
        title: "Sue Orwick",
        user_id: '5ddcc094-c9e2-4a59-9378-9bbfb92ac1b2'
      },
      {
        id: uuid(),
        start: moment('2023-05-22')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-05-22')
          .endOf('isoWeek')
          .toDate(),
        title: "Doug Albertson",
        user_id: '371e0b1b-1a85-4d0d-830e-499786ef7e9f'
      },
      {
        id: uuid(),
        start: moment('2023-05-29')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-05-29')
          .endOf('isoWeek')
          .toDate(),
        title: "Stephanie Kuster",
        user_id: '23266588-7773-438d-83eb-1a84d0c72245'
      },
      {
        id: uuid(),
        start: moment('2023-06-05')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-06-05')
          .endOf('isoWeek')
          .toDate(),
        title: "Brian Schipke",
        user_id: '2a6481a9-0bae-4caf-bbcb-65365fbda2fa'
      },
      {
        id: uuid(),
        start: moment('2023-06-12')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-06-12')
          .endOf('isoWeek')
          .toDate(),
        title: "Wendy Huft",
        user_id: '37157f68-c779-4838-8793-e0c5d4a69267'
      },
      {
        id: uuid(),
        start: moment('2023-06-19')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-06-19')
          .endOf('isoWeek')
          .toDate(),
        title: "Kelli Wieczorek",
        user_id: '8b609a69-902b-4891-8d33-4b598c1076a8'
      },
      {
        id: uuid(),
        start: moment('2023-06-26')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-06-26')
          .endOf('isoWeek')
          .toDate(),
        title: "Sue Orwick",
        user_id: '5ddcc094-c9e2-4a59-9378-9bbfb92ac1b2'
      },
      {
        id: uuid(),
        start: moment('2023-07-03')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-07-03')
          .endOf('isoWeek')
          .toDate(),
        title: "Chris Schipke",
        user_id: '8b08c91b-5e37-47d1-a11b-0bef3a10fbdd'
      },
      {
        id: uuid(),
        start: moment('2023-07-10')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-07-10')
          .endOf('isoWeek')
          .toDate(),
        title: "Dwight Schipke",
        user_id: '2a28e790-46ad-49c2-b6b6-836161477a9d'
      },
      {
        id: uuid(),
        start: moment('2023-07-17')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-07-17')
          .endOf('isoWeek')
          .toDate(),
        title: "Jill Orwick",
        user_id: 'b7e8648a-3659-4faf-b361-0ac91dd9c67d'
      },
      {
        id: uuid(),
        start: moment('2023-07-24')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-07-24')
        .endOf('isoWeek')
        .toDate(),
          allDay: true,
        title: "Denise Smeenk",
        user_id: '2a778ee1-0dff-4633-a825-c58fedf30684'
      },
      {
        id: uuid(),
        start: moment('2023-07-31')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-07-31')
          .endOf('isoWeek')
          .toDate(),
        title: "Dick Kuster",
        user_id: '1f591ff2-0c55-460e-bd01-1c1b1294ad6a',
      },
      {
        id: uuid(),
        start: moment('2023-08-07')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-08-07')
          .endOf('isoWeek')
          .toDate(),
        title: "Chris Kuster",
        user_id: '272ee54e-5ba8-4cf8-ab6d-bdf9032b7b5a'
      },
      {
        id: uuid(),
        start: moment('2023-08-14')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-08-14')
          .endOf('isoWeek')
          .toDate(),
        title: "Dwight Schipke",
        user_id: '2a28e790-46ad-49c2-b6b6-836161477a9d'
      },
      {
        id: uuid(),
        start: moment('2023-08-21')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-08-21')
          .endOf('isoWeek')
          .toDate(),
        title: "Demian Heinert",
        user_id: 'c563409e-e4d1-49c7-99e9-873d094ce9cc'
      },
      {
        id: uuid(),
        start: moment('2023-08-28')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-08-28')
          .endOf('isoWeek')
          .toDate(),
        title: "Steven Schipke",
        user_id: 'eb3169b4-3935-4bf3-9feb-3acc19ea71dd'
      },
      {
        id: uuid(),
        start: moment('2023-09-04')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-09-04')
          .endOf('isoWeek')
          .toDate(),
        title: "Mark Snoozy",
        user_id: '6e81bb50-e350-4c87-928e-14c373a6eb3f'
      },
      {
        id: uuid(),
        start: moment('2023-09-11')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-09-11')
          .endOf('isoWeek')
          .toDate(),
        title: "Christine Orwick",
        user_id: '3b814266-9b58-4e25-aae6-cde737e526ed'
      },
      {
        id: uuid(),
        start: moment('2023-09-18')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-09-18')
          .endOf('isoWeek')
          .toDate(),
        title: "Stephanie Schipke",
        user_id: 'b7e78347-aacd-4fbb-ae9d-23b6e1e7f993'
      },
      {
        id: uuid(),
        start: moment('2023-09-25')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-09-25')
          .endOf('isoWeek')
          .toDate(),
        title: "Mike Albertson",
        user_id: '7ce93aa0-1b60-4d1a-926a-2cc87c2f41fe'
      },
      {
        id: uuid(),
        start: moment('2023-10-02')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-10-02')
          .endOf('isoWeek')
          .toDate(),
        title: "Gale Schipke",
        user_id: '2be3704b-3ab5-4cd4-9630-a056d76a2bc0'
      },
      {
        id: uuid(),
        start: moment('2023-10-09')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-10-09')
          .endOf('isoWeek')
          .toDate(),
        title: "Paul Schipke",
        user_id: '864ea051-2610-4f62-88b0-29f50df3f3d2'
      },
      {
        id: uuid(),
        start: moment('2023-10-16')
        .startOf('isoWeek')
        .toDate(),
        end: moment('2023-10-16')
          .endOf('isoWeek')
          .toDate(),
        title: "Melanie Garstenshiager",
        user_id: 'a98e122d-ecde-445a-9a25-9aaa49d3e53a'
      },
    ]

    const mockReservations = reservations.map(res => {
      res.notes="Checkin 12:00, Checkout 12:00"
      return res
    })

    export default mockReservations;