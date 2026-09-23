# Dataset handling

The project uses the existing V5 synthetic dataset at:

`C:\Users\VARSHINI\OneDrive\Documents\Desktop\RWA\synthetic_investor_dataset.csv`

The CSV is intentionally not copied into this project. Scripts should read it
through `config/dataset_config.json` and should never write back to the source.

Before finalizing the circuit, document how `eligibility_label` was created and
identify any features that are derived from or downstream of that label.

