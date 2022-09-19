Feature: Migrate booking from legacy

Scenario: "Migrate from google event"
    Given that my booking id is 1
    When I publish the event to migrate booking from legacy
    Then i can see the created booking ID